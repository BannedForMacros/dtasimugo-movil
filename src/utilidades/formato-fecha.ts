// Utilidades de fecha que no dependen del huso horario del dispositivo.
// El backend ya entrega DATE como string YYYY-MM-DD (override OID 1082).

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function fechaHoyIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export function partesFecha(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { y: parseInt(match[1], 10), m: parseInt(match[2], 10), d: parseInt(match[3], 10) };
}

export function formatearLargo(iso: string | null | undefined): string {
  if (!iso) return '';
  const p = partesFecha(iso);
  if (!p) return iso;
  return `${p.d} de ${MESES[p.m - 1]} de ${p.y}`;
}

export function formatearCorto(iso: string | null | undefined): string {
  if (!iso) return '';
  const p = partesFecha(iso);
  if (!p) return iso;
  return `${String(p.d).padStart(2, '0')}/${MESES_CORTOS[p.m - 1]}/${p.y}`;
}

export function formatearMoneda(valor: number, moneda: 'USD' | 'PEN' = 'USD'): string {
  const simbolo = moneda === 'USD' ? 'US$' : 'S/';
  return `${simbolo} ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fechaToIso(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

export function isoToFecha(iso: string): Date {
  const p = partesFecha(iso);
  if (!p) return new Date();
  return new Date(p.y, p.m - 1, p.d);
}
