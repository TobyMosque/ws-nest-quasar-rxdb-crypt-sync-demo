<template>
  <q-page class="row items-center justify-evenly">
    <q-table :rows="people" :columns="columns" :filter="filter">
      <template v-slot:top>
        <q-btn color="positive" label="Add Person" @click="onCreate" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-xs">
          <q-btn color="primary" icon="edit" round dense @click="onUpdate(props.row)"></q-btn>
          <q-btn
            color="negative"
            icon="delete"
            round
            dense
            @click="onRemove(props.row)"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
    <upsert-card v-model:id="dialogId" v-model:mode="dialogMode"></upsert-card>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePeopleStore } from 'src/stores/people';
import OpenApiSchema from 'api-sdk/openapi.json';
import { DocPerson } from 'src/types/database/person';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import UpsertCard from 'components/UpsertCard.vue'

const quasar = useQuasar();
const peopleStore = usePeopleStore();
const { people } = storeToRefs(peopleStore);
const { remove } = peopleStore;

const filter = ref<string>('');
const dialogId = ref<string>();
const dialogMode = ref<'update' | 'create'>();

const columns = Object.keys(OpenApiSchema.components.schemas.Person.properties)
  .filter((key) => key !== 'personId')
  .map((key) => ({
    field: key,
    name: key,
    label: key
      .replace(/^([a-z])/, (a) => a.toUpperCase())
      .replace(/[a-z]([A-Z])/, (a) => a[0] + ' ' + a[1]),
  }));

columns.push({ field: 'personId', name: 'actions', label: 'Actions' });

function onCreate() {
  dialogId.value = undefined
  dialogMode.value = 'create'
}

function onUpdate(person: DocPerson) {
  dialogId.value = person.personId
  dialogMode.value = 'update'
}

function onRemove(person: DocPerson) {
  const name = `person ${person.firstName} ${person.lastName}`;
  quasar
    .dialog({
      title: 'Delete Person',
      message: `that will remove the ${name}. do you are sure?`,
      color: 'negative',
      ok: 'Yes',
      cancel: 'No',
    })
    .onOk(async function () {
      await remove(person.personId)
      quasar.notify({
        color: 'negative',
        message: `${name} removed`,
      });
    });
}
</script>
