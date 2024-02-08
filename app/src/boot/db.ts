import { boot } from 'quasar/wrappers';
import { createDb, startReplication } from 'src/composables/db';

export default boot(async ({ store }) => {
  await createDb(store);
  startReplication(store);
});
