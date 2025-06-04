import { createClient } from '@supabase/supabase-js';
import {
    lastOfArray,
    RxDatabase,
    RxReplicationPullStreamItem,
    RxReplicationWriteToMasterRow,
} from 'rxdb';
import { Subject } from 'rxjs';
import { CheckpointType, RxTodoDocument, RxTodoCollections } from './types';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { RxTodoDocumentType } from './TodoSchema';
import { RealtimeChannel } from '@supabase/realtime-js';
import { RxStorageAsyncStorage } from 'rxdb/plugins/storage-asyncstorage';

const SUPABASE_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const SUPABASE_URL = 'http://127.0.0.1:54321';

export const todoCollectionName = 'todos';

export async function startReplication(
    database: RxDatabase<RxTodoCollections>,
    storage: RxStorageAsyncStorage
) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_TOKEN);
    const pullStream$ = new Subject<
        RxReplicationPullStreamItem<RxTodoDocument, CheckpointType>
    >();

    console.log("Starting replication...");

    try {
    // Create a broadcast channel for realtime updates
    const channel = supabase.channel('todos-broadcast', {
        config: {
            broadcast: {
                self: true, // Receive your own broadcasts
            },
        },
    });

    // Subscribe to changes
    channel
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'todos' },
            (payload: any) => {
                console.log('Change received!', payload);
                const doc = payload.new as RxTodoDocumentType;

                pullStream$.next({
                    checkpoint: {
                        title: doc.title || '',
                        updatedAt: doc.updatedAt || 0,
                    },
                    documents: [doc as any],
                });
            }
        )
        .subscribe((status: string, err?: Error) => {
            console.log('STATUS changed:', status);
            if (status === 'SUBSCRIBED') {
                pullStream$.next('RESYNC');
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                console.log('Channel closed or error, attempting to reconnect...');
                if (err) {
                    console.error('Channel error:', err);
                }
                // The channel will automatically attempt to reconnect
            }
        });
    } catch (error) {
        console.error('Failed to start replication:', error);
    }

    console.log("Continuing replication...");
    try {
    const replicationState = await replicateRxCollection<
        RxTodoDocumentType,
        CheckpointType
    >({
        collection: database[todoCollectionName],
        replicationIdentifier: 'supabase-replication-to-' + SUPABASE_URL,
        deletedField: 'deleted',
        closeDuplicates: true,
        //storage: storage,
        waitForLeadership: false, 
        pull: {
            async handler(lastCheckpoint, batchSize) {
                console.log('# pull handler called');
                const minTimestamp = lastCheckpoint
                    ? lastCheckpoint.updatedAt
                    : 0;
                console.log('minTimestamp: ' + minTimestamp);

                // const all = await supabase.from('heroes');
                // console.log('all:');
                // console.dir(all.data);

                const { data, error } = await supabase
                    .from('todos')
                    .select()
                    .gt('updatedAt', minTimestamp) // TODO also compare checkpoint.id
                    .order('updatedAt', { ascending: true })
                    .limit(batchSize);
                if (error) {
                    throw error;
                }
                const docs : RxTodoDocumentType[] = data;
                console.log('pull data:');
                console.dir(docs);

                return {
                    documents: docs,
                    checkpoint:
                        docs.length === 0
                            ? lastCheckpoint
                            : {
                                  name: lastOfArray(docs)?.title || '',
                                  updatedAt: lastOfArray(docs)?.updatedAt || 0,
                              },
                };
            },
            batchSize: 10,
            stream$: pullStream$.asObservable(),
        },
        push: {
            batchSize: 1,
            /**
             * TODO all these ifs and elses could be a
             * supabase rpc() call instead.
             */
            async handler(
                rows: RxReplicationWriteToMasterRow<RxTodoDocumentType>[]
            ) {
                console.log('# pushHandler() called');
                console.dir(rows);

                if (rows.length !== 1) {
                    throw new Error('# pushHandler(): too many push documents');
                }

                const row = rows[0];
                const oldDoc = row.assumedMasterState;
                const doc = row.newDocumentState;

                // insert
                if (!row.assumedMasterState) {
                    const { error } = await supabase
                        .from('todos')
                        .insert([doc]);
                    if (error) {
                        // we have an insert conflict
                        const conflictDocRes = await supabase
                            .from('todos')
                            .select()
                            .eq('title', doc.title)
                            .limit(1);
                        return [conflictDocRes.data[0]];
                    } else {
                        return [];
                    }
                }
                // update
                console.log('# pushHandler(): is update');
                const { data, error } = await supabase
                    .from('todos')
                    .update(doc)
                    .match({
                        title: doc.title,
                        replicationRevision: oldDoc?.replicationRevision,
                    })
                    .select();
                if (error) {
                    console.log('# pushHandler(): error:');
                    console.dir(error);
                    console.dir(data);
                    throw error;
                }
                console.log('# update response:');
                console.dir(data);
                if (data.length === 0) {
                    // we have an updated conflict
                    const conflictDocRes = await supabase
                        .from('todos')
                        .select()
                        .eq('title', doc.title)
                        .limit(1);
                    return [conflictDocRes.data[0]];
                }
                return [];
            },
        },
    });
    replicationState.error$.subscribe((err) => {
        console.error('## replicationState.error$:');
        console.dir(err);
    });

    console.log("Replication state successfully configured");
    return replicationState;

    } catch (error) {
        console.error('Failed to replicate:', error);
    }
    return null;
}

