import { Pinia } from 'pinia';
import { Configuration, PeopleApi } from 'api-sdk';
import { useDiscard } from './utils';
import { useDiStore } from 'src/stores/di';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    peopleApi: PeopleApi;
  }
}

function createConfiguration(pinia: Pinia) {
  useDiscard({ pinia });
  return new Configuration({
    basePath: 'http://localhost:3000',
    fetchApi: fetch,
    middleware: [
      {
        async pre(context) {
          return context;
        },
        async post(context) {
          return context.response;
        },
        async onError(context) {
          console.error(context);
          return context.response;
        },
      },
    ],
  });
}

export function createApi(pinia: Pinia) {
  const config = createConfiguration(pinia);
  const peopleApi = new PeopleApi(config);

  pinia.use(() => ({ peopleApi }));
}

export function usePeopleApi(pinia?: Pinia) {
  const di = useDiStore(pinia);
  return di.peopleApi;
}
