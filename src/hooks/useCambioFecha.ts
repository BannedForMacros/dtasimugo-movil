import { useCallback, useEffect, useState } from 'react';
import { obtenerJson } from '../services/cliente-http';
import { TipoCambioDia } from '../tipos';

const cache = new Map<string, TipoCambioDia>();

export function useCambioFecha(fecha: string | null | undefined) {
  const [tc, setTc] = useState<TipoCambioDia | null>(null);
  const [cargando, setCargando] = useState(false);

  const consultar = useCallback(async (f: string) => {
    if (cache.has(f)) {
      setTc(cache.get(f)!);
      return;
    }
    setCargando(true);
    try {
      const r = await obtenerJson<{ tipo_cambio: TipoCambioDia }>('/api/cambio', { date: f });
      cache.set(f, r.tipo_cambio);
      setTc(r.tipo_cambio);
    } catch {
      setTc(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (fecha) consultar(fecha);
    else setTc(null);
  }, [fecha, consultar]);

  return { tc, cargando };
}
