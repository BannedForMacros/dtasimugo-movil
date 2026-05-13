import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import {
  leerAccesoSync,
  leerRefreshSync,
  actualizarAcceso,
  actualizarRefresh,
  limpiarTokens,
  guardarTokens
} from './tokenLocal';

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants.expoConfig?.extra as any)?.apiBaseUrl ||
  'http://10.0.2.2:4001';

export const clienteHttp = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

clienteHttp.interceptors.request.use((cfg) => {
  const t = leerAccesoSync();
  if (t && cfg.headers) {
    (cfg.headers as any).Authorization = `Bearer ${t}`;
  }
  return cfg;
});

// Refresh coordinado: una sola peticion concurrente.
let refrescando: Promise<string | null> | null = null;
let escuchadores: Array<(t: string | null) => void> = [];
let sesionExpiradaCb: (() => void) | null = null;

export function setOnSesionExpirada(cb: () => void) {
  sesionExpiradaCb = cb;
}

async function ejecutarRefresh(): Promise<string | null> {
  const refresh = leerRefreshSync();
  if (!refresh) return null;
  try {
    const r = await axios.post(`${apiBaseUrl}/api/auth/refresh`, { refresh_token: refresh });
    const nuevoAcc = r.data?.access_token as string;
    const nuevoRef = r.data?.refresh_token as string;
    if (!nuevoAcc || !nuevoRef) return null;
    await guardarTokens(nuevoAcc, nuevoRef);
    return nuevoAcc;
  } catch {
    return null;
  }
}

async function obtenerNuevoAcceso(): Promise<string | null> {
  if (!refrescando) {
    refrescando = ejecutarRefresh().finally(() => {
      const cb = escuchadores;
      escuchadores = [];
      const t = leerAccesoSync();
      cb.forEach((fn) => fn(t));
      refrescando = null;
    });
  }
  return refrescando;
}

clienteHttp.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { __retried?: boolean };
    const status = error.response?.status;

    if (status === 401 && !original?.__retried) {
      const url = (original?.url || '').toString();
      // No reintentar el propio refresh ni el login.
      if (url.includes('/api/auth/refresh') || url.includes('/api/auth/ingreso')) {
        return Promise.reject(error);
      }

      const nuevo = await obtenerNuevoAcceso();
      if (!nuevo) {
        await limpiarTokens();
        if (sesionExpiradaCb) sesionExpiradaCb();
        return Promise.reject(error);
      }

      if (original && original.headers) {
        (original.headers as any).Authorization = `Bearer ${nuevo}`;
        original.__retried = true;
      }
      return clienteHttp.request(original);
    }

    return Promise.reject(error);
  }
);

export async function obtenerJson<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const r = await clienteHttp.get<T>(url, { params });
  return r.data;
}

export async function enviarJson<T = any>(url: string, data?: any): Promise<T> {
  const r = await clienteHttp.post<T>(url, data);
  return r.data;
}

export async function actualizarJson<T = any>(url: string, data?: any): Promise<T> {
  const r = await clienteHttp.patch<T>(url, data);
  return r.data;
}

export async function eliminarJson<T = any>(url: string): Promise<T> {
  const r = await clienteHttp.delete<T>(url);
  return r.data;
}

export { actualizarAcceso, actualizarRefresh };
