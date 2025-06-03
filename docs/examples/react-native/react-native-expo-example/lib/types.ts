import { RxCollection, RxDocument } from 'rxdb';
import { RxTodoDocumentType } from './TodoSchema';

export type RxTodoDocument = RxDocument<RxTodoDocumentType, {}>;
export type RxTodoCollection = RxCollection<RxTodoDocumentType, {}, {}>;
export type RxTodoCollections = {
    todos: RxTodoCollection;
};
export type CheckpointType = {
    title: string;
    updatedAt: number;
};
