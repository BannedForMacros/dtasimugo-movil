import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  guardarTokens,
  limpiarTokens,
  inicializarCache
} from '../services/tokenLocal';
import { enviarJson, obtenerJson, setOnSesionExpirada } from '../services/cliente-http';
import { Cuenta, TipoCambioDia } from '../tipos';

interface SesionCtx {
  cuenta: Cuenta | null;
  cargandoSesion: boolean;
  cotizacionDia: TipoCambioDia | null;
  iniciarSesion: (correo: string, clave: string) => Promise<void>;
  registrar: (datos: { correo: string; nombres_completos: string; alias?: string; clave: string }) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  refrescarCuenta: () => Promise<void>;
  refrescarCotizacion: () => Promise<void>;
}

const Contexto = createContext<SesionCtx | null>(null);

export function SesionProvider({ children }: { children: React.ReactNode }) {
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [cotizacionDia, setCotizacionDia] = useState<TipoCambioDia | null>(null);

  const refrescarCotizacion = useCallback(async () => {
    try {
      const r = await obtenerJson<{ tipo_cambio: TipoCambioDia }>('/api/cambio');
      setCotizacionDia(r.tipo_cambio);
    } catch {
      // tolerable: la cotizacion no rompe la sesion
    }
  }, []);

  const refrescarCuenta = useCallback(async () => {
    try {
      const r = await obtenerJson<{ cuenta: Cuenta }>('/api/auth/perfil');
      setCuenta(r.cuenta);
    } catch {
      setCuenta(null);
    }
  }, []);

  useEffect(() => {
    setOnSesionExpirada(() => {
      setCuenta(null);
      Alert.alert('Sesion expirada', 'Vuelve a ingresar para continuar.');
    });
  }, []);

  useEffect(() => {
    (async () => {
      await inicializarCache();
      await refrescarCuenta();
      await refrescarCotizacion();
      setCargandoSesion(false);
    })();
  }, [refrescarCuenta, refrescarCotizacion]);

  const iniciarSesion = useCallback(async (correo: string, clave: string) => {
    const r = await enviarJson<{
      cuenta: Cuenta;
      access_token: string;
      refresh_token: string;
    }>('/api/auth/ingreso', { correo: correo.trim().toLowerCase(), clave });
    await guardarTokens(r.access_token, r.refresh_token);
    setCuenta(r.cuenta);
    await refrescarCotizacion();
  }, [refrescarCotizacion]);

  const registrar = useCallback(async (datos: { correo: string; nombres_completos: string; alias?: string; clave: string }) => {
    await enviarJson('/api/auth/registro', {
      correo: datos.correo.trim().toLowerCase(),
      nombres_completos: datos.nombres_completos.trim(),
      alias: datos.alias?.trim() || undefined,
      clave: datos.clave
    });
  }, []);

  const cerrarSesion = useCallback(async () => {
    await limpiarTokens();
    setCuenta(null);
  }, []);

  return (
    <Contexto.Provider value={{
      cuenta,
      cargandoSesion,
      cotizacionDia,
      iniciarSesion,
      registrar,
      cerrarSesion,
      refrescarCuenta,
      refrescarCotizacion
    }}>
      {children}
    </Contexto.Provider>
  );
}

export function useSesion() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('SesionContext sin provider');
  return ctx;
}
