import * as SecureStore from 'expo-secure-store';

const LL_ACCESO = 'dtasimugo_access_token';
const LL_REFRESH = 'dtasimugo_refresh_token';

let cacheAcceso: string | null = null;
let cacheRefresh: string | null = null;

export async function inicializarCache(): Promise<void> {
  try {
    const a = await SecureStore.getItemAsync(LL_ACCESO);
    const r = await SecureStore.getItemAsync(LL_REFRESH);
    cacheAcceso = a;
    cacheRefresh = r;
  } catch {
    cacheAcceso = null;
    cacheRefresh = null;
  }
}

export function leerAccesoSync(): string | null {
  return cacheAcceso;
}

export function leerRefreshSync(): string | null {
  return cacheRefresh;
}

export async function guardarTokens(acceso: string, refresh: string): Promise<void> {
  cacheAcceso = acceso;
  cacheRefresh = refresh;
  await SecureStore.setItemAsync(LL_ACCESO, acceso);
  await SecureStore.setItemAsync(LL_REFRESH, refresh);
}

export async function actualizarAcceso(acceso: string): Promise<void> {
  cacheAcceso = acceso;
  await SecureStore.setItemAsync(LL_ACCESO, acceso);
}

export async function actualizarRefresh(refresh: string): Promise<void> {
  cacheRefresh = refresh;
  await SecureStore.setItemAsync(LL_REFRESH, refresh);
}

export async function limpiarTokens(): Promise<void> {
  cacheAcceso = null;
  cacheRefresh = null;
  await SecureStore.deleteItemAsync(LL_ACCESO);
  await SecureStore.deleteItemAsync(LL_REFRESH);
}
