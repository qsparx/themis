import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema
} from 'rxdb';

export const todoSchemaLiteral = {
  version: 0,
  title: 'todo',
  description: 'A simple todo schema',
  primaryKey: 'id', // <= the primary key is must
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100, // <- the primary key must have set maxLength
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    done: {
      type: 'boolean',
    },
    updatedAt: {
      type: 'number',
      minimum: 0,
      maximum: 1000000000000000,
      multipleOf: 1
    },
    replicationRevision: {
        type: 'string',
        minLength: 3
    }
  },
} as const;

const schemaTyped = toTypedRxJsonSchema(todoSchemaLiteral);
export type RxTodoDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const todoSchema: RxJsonSchema<RxTodoDocumentType> = todoSchemaLiteral;

