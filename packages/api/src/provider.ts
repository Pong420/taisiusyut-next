import { Provider } from './provider/_provider';
import xbiquge_so from './provider/xbiquge.so';

const providers = [xbiquge_so];
export const providerMap = providers.reduce(
  (providers, Provider) => ({ ...providers, [Provider.id]: new Provider() }),
  {} as Record<string, Provider>
);

export const getProvider = (id: string) => {
  const provider = providerMap[id];
  if (!provider) throw new Error(`Provider not found`);
  return provider;
};
