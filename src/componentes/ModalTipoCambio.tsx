import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModalApp from './ui/ModalApp';
import { tema } from '../estilos/tema';
import { TipoCambioDia } from '../tipos';
import { formatearLargo } from '../utilidades/formato-fecha';

interface Props {
  visible: boolean;
  onCerrar: () => void;
  tc: TipoCambioDia | null;
}

export default function ModalTipoCambio({ visible, onCerrar, tc }: Props) {
  return (
    <ModalApp visible={visible} titulo="Tipo de cambio" subtitulo="Fuente Decolecta / SBS" onCerrar={onCerrar}>
      {tc ? (
        <View>
          <Text style={styles.fecha}>{formatearLargo(tc.fecha)}</Text>
          <View style={styles.fila}>
            <View style={styles.tarjeta}>
              <Text style={styles.etq}>Compra</Text>
              <Text style={styles.val}>S/ {tc.precio_compra.toFixed(4)}</Text>
            </View>
            <View style={styles.tarjeta}>
              <Text style={styles.etq}>Venta</Text>
              <Text style={styles.val}>S/ {tc.precio_venta.toFixed(4)}</Text>
            </View>
          </View>
          <Text style={styles.nota}>USD por 1 PEN.</Text>
        </View>
      ) : <Text style={styles.fecha}>Sin datos</Text>}
    </ModalApp>
  );
}

const styles = StyleSheet.create({
  fecha: { textAlign: 'center', color: tema.textoSecundario, marginBottom: 14 },
  fila: { flexDirection: 'row', gap: 12 },
  tarjeta: { flex: 1, backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, alignItems: 'center' },
  etq: { fontSize: 12, color: tema.textoSecundario, fontWeight: '700' },
  val: { fontSize: 22, color: tema.primario, fontWeight: '800', marginTop: 4 },
  nota: { textAlign: 'center', color: tema.textoTerciario, fontSize: 11, marginTop: 12 }
});
