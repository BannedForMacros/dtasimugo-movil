import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tema } from '../estilos/tema';
import { AsientoContable } from '../tipos';
import { formatearMoneda } from '../utilidades/formato-fecha';

interface Props {
  asiento: AsientoContable;
  divisa: 'USD' | 'PEN';
}

export default function TablaAsiento({ asiento, divisa }: Props) {
  const cuadrado = Math.abs(asiento.diferencia) <= 0.01;

  return (
    <View>
      <View style={styles.cabecera}>
        <Text style={[styles.col, { flex: 1 }]}>Cuenta</Text>
        <Text style={[styles.col, styles.right]}>Debe</Text>
        <Text style={[styles.col, styles.right]}>Haber</Text>
      </View>
      {asiento.detalles.map((l, i) => (
        <View key={i} style={styles.fila}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cuenta}>{l.cuenta}</Text>
            <Text style={styles.nombre} numberOfLines={2}>{l.nombre_cuenta}</Text>
          </View>
          <Text style={[styles.monto, styles.right]}>{l.debe > 0 ? formatearMoneda(l.debe, divisa) : '-'}</Text>
          <Text style={[styles.monto, styles.right]}>{l.haber > 0 ? formatearMoneda(l.haber, divisa) : '-'}</Text>
        </View>
      ))}
      <View style={styles.totales}>
        <Text style={[styles.col, { flex: 1, fontWeight: '800' }]}>Totales</Text>
        <Text style={[styles.totalMonto, styles.right]}>{formatearMoneda(asiento.total_debe, divisa)}</Text>
        <Text style={[styles.totalMonto, styles.right]}>{formatearMoneda(asiento.total_haber, divisa)}</Text>
      </View>
      <Text style={[styles.diferencia, { color: cuadrado ? tema.exito : tema.error }]}>
        {cuadrado ? 'Asiento cuadrado' : `Diferencia: ${formatearMoneda(Math.abs(asiento.diferencia), divisa)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cabecera: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: tema.borde },
  col: { color: tema.textoSecundario, fontWeight: '700', fontSize: 12, width: 110 },
  right: { textAlign: 'right' },
  fila: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: tema.bordeClaro },
  cuenta: { color: tema.primario, fontWeight: '700', fontSize: 13 },
  nombre: { color: tema.textoPrincipal, fontSize: 12, marginTop: 2 },
  monto: { color: tema.textoPrincipal, fontWeight: '600', fontSize: 12, width: 110 },
  totales: { flexDirection: 'row', paddingTop: 10, borderTopWidth: 1.5, borderTopColor: tema.borde, marginTop: 4 },
  totalMonto: { color: tema.primario, fontWeight: '800', fontSize: 13, width: 110 },
  diferencia: { textAlign: 'center', fontWeight: '700', marginTop: 10, fontSize: 13 }
});
