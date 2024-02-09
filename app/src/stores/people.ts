import { defineStore } from 'pinia';
import { tap } from 'rxjs/operators';
import { usePeopleDb } from 'src/composables/db';
import { ref } from 'vue';
import type { RxPerson, DocPerson } from 'src/types/database/person';

export const usePeopleStore = defineStore('people', () => {
  const people = ref<DocPerson[]>([]);

  const loading = ref(false);
  const peopleDb = usePeopleDb();

  async function syncPeople() {
    loading.value = true;
    const query = peopleDb.people.find();

    query.$.pipe(
      tap(() => {
        setTimeout(() => (loading.value = false), 1000);
      }),
    ).subscribe((result: RxPerson[]) => {
      people.value = result.map(doc => doc.toMutableJSON());
    });
  }

  peopleDb.people.remove$.subscribe(changeEvent => {
    changeEvent.documentData.updatedAt = new Date().toISOString()
  });

  async function personById(id: string): Promise<DocPerson> {
    const doc = await peopleDb.people.findOne({
      selector: {
        personId: id
      }
    }).exec();
    return doc.toMutableJSON()
  }

  async function remove(id: string) {
    await peopleDb.people.findOne({
      selector: {
        personId: id
      }
    }).remove();
  }

  async function upsert(person: DocPerson) {
    await peopleDb.people.upsert({ ...person, updatedAt: new Date().toISOString() });
  }

  syncPeople();
  return {
    people,
    personById,
    remove,
    upsert,
  };
});
