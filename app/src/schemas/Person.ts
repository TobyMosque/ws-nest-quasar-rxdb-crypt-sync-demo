import { RxJsonSchema } from 'rxdb';
import type { RxPerson } from 'src/types/database/person';

export const PersonSchema = {
  required: [
    'personId',
    'firstName',
    'lastName',
    'gender',
    'email',
    '_deleted',
    'updatedAt',
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
    _deleted: {
      type: 'boolean',
    },
    updatedAt: {
      format: 'date-time',
      type: 'string',
    },
  },
} as const;

export const RxPersonSchema: RxJsonSchema<RxPerson> = PersonSchema as never;
