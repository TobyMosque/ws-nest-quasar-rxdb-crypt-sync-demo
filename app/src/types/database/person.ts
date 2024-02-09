import { RxCollection, RxDocument, createRxDatabase } from 'rxdb';
import { Person } from 'api-sdk';
import { JsonDoc, RxDoc } from '.';

export type JsonPerson = JsonDoc<Person>;
export type DocPerson = RxDoc<JsonPerson>
export type RxPerson = RxDocument<DocPerson>;

export type PersonCheckPoint = {
  personId: string;
  upsertedAt: string;
};

export interface RxPeopleCollections {
  people: RxCollection<RxPerson>;
}

export type PeopleDb = Awaited<
  ReturnType<typeof createRxDatabase<RxPeopleCollections>>
>;
