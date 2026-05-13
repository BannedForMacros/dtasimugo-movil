import { AsientoContable } from '../tipos';
import { formatearMoneda } from './formato-fecha';

export function plantillaPdfAsiento(asiento: AsientoContable, titulo: string): string {
  const fila = (l: { cuenta: string; nombre_cuenta: string; debe: number; haber: number }) => `
    <tr>
      <td><b>${l.cuenta}</b><br/><span class="s">${l.nombre_cuenta}</span></td>
      <td class="r">${l.debe > 0 ? formatearMoneda(l.debe, asiento.moneda as 'USD' | 'PEN') : '-'}</td>
      <td class="r">${l.haber > 0 ? formatearMoneda(l.haber, asiento.moneda as 'USD' | 'PEN') : '-'}</td>
    </tr>`;

  const cuadrado = Math.abs(asiento.diferencia) <= 0.01;

  return `
  <!DOCTYPE html>
  <html><head><meta charset="UTF-8" /><title>${titulo}</title>
  <style>
    body { font-family: -apple-system, Arial, sans-serif; color: #111827; padding: 30px; }
    h1 { color: #1d3a8a; margin: 0 0 4px 0; }
    .sub { color: #6b7280; font-size: 12px; margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { padding: 8px 8px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    th { background: #eff6ff; color: #1d3a8a; text-align: left; }
    .r { text-align: right; }
    .s { color: #6b7280; font-size: 11px; }
    .tot { background: #f9fafb; font-weight: 800; color: #1d3a8a; }
    .estado { padding: 10px; border-radius: 8px; margin-top: 14px; text-align: center; font-weight: 700; }
    .ok { background: #ecfdf5; color: #16a34a; }
    .err { background: #fef2f2; color: #dc2626; }
    .pie { color: #9ca3af; font-size: 10px; text-align: center; margin-top: 28px; }
  </style></head>
  <body>
    <h1>DTASimuGo</h1>
    <div class="sub">${titulo} - ${asiento.glosa}</div>

    <table>
      <thead><tr><th>Cuenta</th><th class="r">Debe</th><th class="r">Haber</th></tr></thead>
      <tbody>
        ${asiento.detalles.map(fila).join('')}
        <tr class="tot">
          <td>Totales (${asiento.moneda})</td>
          <td class="r">${formatearMoneda(asiento.total_debe, asiento.moneda as 'USD' | 'PEN')}</td>
          <td class="r">${formatearMoneda(asiento.total_haber, asiento.moneda as 'USD' | 'PEN')}</td>
        </tr>
      </tbody>
    </table>

    <div class="estado ${cuadrado ? 'ok' : 'err'}">
      ${cuadrado ? 'Asiento cuadrado' : `Diferencia ${formatearMoneda(Math.abs(asiento.diferencia), asiento.moneda as 'USD' | 'PEN')}`}
    </div>

    <div class="pie">DTASimuGo - Documento generado automaticamente</div>
  </body></html>`;
}
