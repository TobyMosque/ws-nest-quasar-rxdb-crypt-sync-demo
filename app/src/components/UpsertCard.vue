<template>
  <q-dialog :model-value="!!mode" @hide="onHide">
    <q-card v-if="person" style="min-width: 360px;">
      <q-card-section class="text-h6 text-center">
        {{ mode === 'create' ? 'Create Person' : 'Update Person' }}
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-gutter-y-sm">
        <q-input label="First Name" filled v-model="person.firstName"></q-input>
        <q-input label="Last Name" filled v-model="person.lastName"></q-input>
        <q-input label="Gender" filled v-model="person.gender"></q-input>
        <q-input label="Email" filled v-model="person.email"></q-input>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="q-gutter-y-sm" align="right">
        <q-btn color="positive" label="cancel" flat @click="onHide"></q-btn>
        <q-btn color="positive" label="confirm" @click="onSave"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { uid, useQuasar } from 'quasar';
import { usePeopleStore } from 'src/stores/people';
import { DocPerson } from 'src/types/database/person';
import { ref, unref, watchEffect } from 'vue';

const id = defineModel<string>('id')
const mode = defineModel<'create' | 'update'>('mode')

const quasar = useQuasar();
const peopleStore = usePeopleStore();
const { personById, upsert } = peopleStore;
const person = ref<DocPerson>();

watchEffect(async () => {
  person.value = undefined
  if (id.value && mode.value === 'update') {
    person.value = await personById(id.value)
  } else {
    person.value = { personId: uid(), firstName: '', lastName: '', gender: '', updatedAt: '', email: '', _deleted: false }
  }
})

function onHide() {
  mode.value = undefined
  id.value = undefined
}

async function onSave() {
  const raw = unref(person)
  if (raw) {
    await upsert(raw)
    const name = `person ${raw.firstName} ${raw.lastName}`;
    quasar.notify({
      color: 'positive',
      message: `${name} saved`,
    });
    onHide()
  }
}
</script>
