import { boot } from 'quasar/wrappers';
import { createApi } from 'src/composables/api';

export default boot(async ({ store }) => {
  createApi(store);
});
