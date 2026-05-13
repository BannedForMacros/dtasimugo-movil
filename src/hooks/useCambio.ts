import { useSesion } from '../contextos/SesionContext';

export type Divisa = 'USD' | 'PEN';

export function useCambio() {
  const { cotizacionDia, refrescarCotizacion } = useSesion();
  return {
    cotizacion: cotizacionDia,
    refrescar: refrescarCotizacion
  };
}
