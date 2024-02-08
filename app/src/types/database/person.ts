import { RxCollection, createRxDatabase } from 'rxdb';
import { Person } from 'api-sdk';
import { JsonDoc as RxDoc } from '.';

export type RxPerson = RxDoc<Person>;
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
