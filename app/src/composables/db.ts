import { Pinia } from 'pinia';
import { SessionStorage, uid } from 'quasar';
import { useDiStore } from 'src/stores/di';
import {
  ReplicationPullHandlerResult,
  createRxDatabase,
  lastOfArray,
} from 'rxdb';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import { RxPersonSchema } from 'src/schemas/Person';

import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { wrappedKeyEncryptionCryptoJsStorage } from 'rxdb/plugins/encryption-crypto-js';
import {
  PeopleDb,
  PersonCheckPoint,
  RxPerson,
} from 'src/types/database/person';
import {
  PeopleControllerBulkUpsertRequest,
  PeopleControllerFindAllRequest,
  PersonFromJSON,
  PersonToJSON,
} from 'api-sdk';
import { usePeopleApi } from './api';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    peopleDb: PeopleDb;
  }
}

export async function createDb(pinia: Pinia) {
  const storage = wrappedValidateAjvStorage({
    storage: wrappedKeyEncryptionCryptoJsStorage({
      storage: getRxStorageDexie(),
    }),
  });

  let sessionId = SessionStorage.getItem<string>('sessionId');
  if (!sessionId) {
    sessionId = uid();
    SessionStorage.set('sessionId', sessionId);
  }

  const peopleDb: PeopleDb = await createRxDatabase({
    name: `/people_` + sessionId,
    storage: storage,
    password: `i_am_not_a_secret`,
  });

  await peopleDb.addCollections({
    people: {
      schema: RxPersonSchema,
      migrationStrategies: {},
    },
  });

  pinia.use(() => ({ peopleDb }));
  return peopleDb;
}

export function usePeopleDb(pinia?: Pinia) {
  const di = useDiStore(pinia);
  return di.peopleDb;
}

export async function startReplication(pinia: Pinia) {
  const peopleDb = usePeopleDb(pinia);
  const peopleApi = usePeopleApi(pinia);

  const replication = await replicateRxCollection({
    collection: peopleDb.collections.people,
    replicationIdentifier: 'api/people',
    live: true,
    deletedField: 'deleted',
    pull: {
      async handler(
        lastCheckpoint: PersonCheckPoint | undefined,
        batchSize: number,
      ) {
        const request: PeopleControllerFindAllRequest = {
          limit: batchSize,
        };
        if (lastCheckpoint) {
          request.minUpdatedAt = new Date(lastCheckpoint.upsertedAt);
        }

        const people = await peopleApi.peopleControllerFindAll(request);
        const documents: RxPerson[] = people?.map(PersonToJSON) || [];

        const res: ReplicationPullHandlerResult<RxPerson, PersonCheckPoint> = {
          documents: [],
          checkpoint: lastCheckpoint ?? null,
        };

        if (documents && documents.length) {
          const person = lastOfArray(documents);

          res.documents = documents as never;
          res.checkpoint = {
            personId: person?.personId ?? '',
            upsertedAt: person?.updatedAt ?? '',
          };
        }
        return res;
      },
    },
    push: {
      async handler(docs) {
        const entities = docs.map((d) => PersonFromJSON(d.newDocumentState));

        const request: PeopleControllerBulkUpsertRequest = {
          bulkUpsertPersonDto: {
            people: entities,
          },
        };

        await peopleApi.peopleControllerBulkUpsert(request);
        return [];
      },
    },
  });

  setInterval(() => replication.reSync(), 5 * 1000);
}
