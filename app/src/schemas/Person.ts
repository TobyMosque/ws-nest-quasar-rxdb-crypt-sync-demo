import { RxJsonSchema } from 'rxdb';
import type { RxPerson } from 'src/types/database/person';

export const PersonSchema = {
  required: [
    'firstName',
    'lastName',
    'gender',
    'email',
  ],
  type: 'object',
  version: 0,
  primaryKey: 'personId',
  properties: {
    personId: {
      require: true,
      type: 'string',
      maxLength: 36,
    },
    firstName: {
      type: 'string',
      maxLength: 18,
    },
    lastName: {
      type: 'string',
    },
    gender: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    isDeleted: {
      type: 'boolean',
    },
    updatedAt: {
      type: 'string',
    },
  },
  encrypted: ['lastName', 'email'],
} as const;

export const RxPersonSchema: RxJsonSchema<RxPerson> = PersonSchema as never;
