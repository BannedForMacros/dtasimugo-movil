import { Operacion, LineaDesglose } from '../tipos';
import { formatearLargo, formatearMoneda } from './formato-fecha';

export function plantillaPdfOperacion(op: Operacion, desglose: LineaDesglose[]): string {
  const fila = (l: LineaDesglose) => `
    <tr>
      <td>${l.concepto_tributario}</td>
      <td class="r">${l.base_imponible ? formatearMoneda(l.base_imponible) : '-'}</td>
      <td class="r">${l.tasa_aplicada !== null && l.tasa_aplicada !== undefined ? l.tasa_aplicada.toFixed(2) + '%' : '-'}</td>
      <td class="r b">${formatearMoneda(l.valor_calculado)}</td>
    </tr>
  `;

  return `
  <!DOCTYPE html>
  <html><head><meta charset="UTF-8" /><title>Operacion ${op.id}</title>
  <style>
    body { font-family: -apple-system, Arial, sans-serif; color: #111827; padding: 30px; }
    h1 { color: #1d3a8a; margin: 0 0 4px 0; }
    h2 { color: #1d3a8a; font-size: 14px; margin-top: 22px; border-bottom: 2px solid #1d3a8a; padding-bottom: 4px; }
    .sub { color: #6b7280; font-size: 12px; margin-bottom: 18px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 12px; }
    .grid .k { color: #6b7280; }
    .grid .v { color: #111827; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th, td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; }
    th { background: #eff6ff; color: #1d3a8a; text-align: left; }
    .r { text-align: right; }
    .b { font-weight: 700; color: #1d3a8a; }
    .total { background: #1d3a8a; color: #fff; padding: 12px; border-radius: 10px; margin-top: 18px; text-align: center; }
    .total .num { font-size: 22px; font-weight: 800; }
    .pie { color: #9ca3af; font-size: 10px; text-align: center; margin-top: 28px; }
  </style></head>
  <body>
    <h1>DTASimuGo</h1>
    <div class="sub">Simulador Aduanero - Detalle de operacion</div>

    <h2>Datos generales</h2>
    <div class="grid">
      <div class="k">Codigo de operacion</div><div class="v">${op.id.slice(0, 8)}</div>
      <div class="k">Modalidad</div><div class="v">${op.modalidad_compra_nacional ? 'Compra nacional' : 'Importacion'}</div>
      <div class="k">Partida arancelaria</div><div class="v">${op.codigo_partida}</div>
      <div class="k">Descripcion partida</div><div class="v">${op.glosa_partida || '-'}</div>
      <div class="k">Categoria PCGE</div><div class="v">${op.cuenta_pcge || '-'} - ${op.denominacion_categoria || '-'}</div>
      <div class="k">Fecha de internacion</div><div class="v">${formatearLargo(op.fecha_internacion)}</div>
    </div>

    <h2>Montos base</h2>
    <div class="grid">
      <div class="k">FOB</div><div class="v">${formatearMoneda(op.monto_fob_usd)}</div>
      <div class="k">Flete</div><div class="v">${formatearMoneda(op.monto_flete_usd)}</div>
      <div class="k">Seguro</div><div class="v">${formatearMoneda(op.monto_seguro_usd)}</div>
      <div class="k">CIF</div><div class="v">${formatearMoneda(op.base_cif_calculada)}</div>
    </div>

    <h2>Desglose tributario</h2>
    <table>
      <thead><tr><th>Concepto</th><th class="r">Base</th><th class="r">Tasa</th><th class="r">Valor</th></tr></thead>
      <tbody>${desglose.map(fila).join('')}</tbody>
    </table>

    <div class="total">
      <div>Obligacion tributaria aduanera</div>
      <div class="num">${formatearMoneda(op.total_obligacion_aduanera)}</div>
    </div>

    <div class="pie">DTASimuGo - Documento generado automaticamente</div>
  </body></html>`;
}
