import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import ThemisCrypto from '../../lib/ThemisCrypto';

import * as Crypto from 'expo-crypto';
if (typeof global.crypto === 'undefined') {
    global.crypto = {
		subtle: {
        	digest: Crypto.digest,
		}
    };
}


import React, { useEffect, useState } from 'react';
import {
    addRxPlugin,
    createRxDatabase,
    createBlob,
    getBlobSize,
    blobToBase64String,
    parseRevision,
    createRevision
} from 'rxdb';
import fetch from 'cross-fetch';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb'
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';

import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { getRxStorageSQLiteTrial, getSQLiteBasicsExpoSQLiteAsync } from 'rxdb/plugins/storage-sqlite';
import * as SQLite from 'expo-sqlite';

import { getRxStorageAsyncStorage } from 'rxdb/plugins/storage-asyncstorage';


addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);


import { todoSchema } from '../../lib/TodoSchema';
import { conflictHandler } from '../../lib/conflict-handler';
import { startReplication } from '../../lib/replication';

export const STORAGE = getRxStorageMemory();
export const STORAGE_SQLITE = wrappedValidateAjvStorage({
    storage: getRxStorageSQLiteTrial({
        sqliteBasics: getSQLiteBasicsExpoSQLiteAsync(SQLite.openDatabaseAsync)
    })
});
export const STORAGE_ASYNC = getRxStorageAsyncStorage();


const dbName = 'todosreactdatabase';
export const todoCollectionName = 'todos';

export default function HomeScreen() {

    useEffect(() => {
      // Define async function inside useEffect
      const fetchData = async () => {
      try {
        const db = await createRxDatabase({
            name: dbName,
            storage: STORAGE_ASYNC,
            multiInstance: true
        });
        await db.addCollections({
              [todoCollectionName]: {
                schema: todoSchema,
                conflictHandler: conflictHandler
              },
            });
        
          
        if (db[todoCollectionName]) {

          /**
           * To make it possible to detect and resolve conflicts,
           * we use a custom field 'replicationRevision' that
           * works similar to the rxdb revision and will be automatically updated on each write.
           * @link https://rxdb.info/transactions-conflicts-revisions.html
           */
          db[todoCollectionName].preInsert(async (docData) => {
              
              console.log(' PRE INSERT !!');
              let rev = 1 + '-' + await db.hashFunction(JSON.stringify(docData));

              console.log('Rev:', rev);
              docData.replicationRevision = rev;
              return docData;
          }, false);
          db[todoCollectionName].preRemove(async (docData) => {
              
              console.log(' PRE REMOVE !!');
              console.log(JSON.stringify(docData, null ,4));
              const oldRevHeight = parseRevision(docData.replicationRevision).height;
              docData.replicationRevision = (oldRevHeight + 1) + '-' + await db.hashFunction(JSON.stringify(docData));
              console.log(JSON.stringify(docData, null ,4));
              return docData;
          }, false);
            db[todoCollectionName].preSave(async (docData) => {
              
              console.log(' PRE SAVE !!');
              console.log(JSON.stringify(docData, null ,4));
              const oldRevHeight = parseRevision(docData.replicationRevision).height;
              docData.replicationRevision = (oldRevHeight + 1) + '-' + await db.hashFunction(JSON.stringify(docData));
              return docData;
          }, false);
          

          try {
          await db[todoCollectionName].insert({
            id: `${Date.now()}`,
            title: 'Antibiotics',
            description: 'Bring Medicine from store',
            done: 'true',
            updatedAt: new Date().getTime(),
          });
          } catch (error) {
            console.error('Failed to insert data:', error);
          }
            
          await db[todoCollectionName].find().$.subscribe((todo: any) => {
                console.log("Got todo list:", todo);
              });
          }

          console.log("Starting replication:", db);
          await startReplication(db as any);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
		      console.log("Rxdb loaded");
        }
      };

      fetchData(); // Call the async function
    }, []); 
		
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
	  <ThemisCrypto/>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
