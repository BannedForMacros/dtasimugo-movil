import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import TarjetaSeccion from '../componentes/ui/TarjetaSeccion';
import BotonContorno from '../componentes/ui/BotonContorno';
import { ResultadoCalculo } from '../tipos';
import { formatearMoneda } from '../utilidades/formato-fecha';
import { tema } from '../estilos/tema';

export default function ResultadoCalculoScreen({ navigation, route }: any) {
  const resultado: ResultadoCalculo = route.params.resultado;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo="Resultado" subtitulo={resultado.modalidad_compra_nacional ? 'Compra nacional' : 'Importacion'} onBack={() => navigation.goBack()} />

      <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.totalCard}>
          <Text style={styles.totalEtq}>Obligacion tributaria aduanera</Text>
          <Text style={styles.totalVal}>{formatearMoneda(resultado.total_obligacion_aduanera)}</Text>
        </View>

        {!resultado.modalidad_compra_nacional ? (
          <TarjetaSeccion titulo="Bases y tributos">
            <Filita etq="Base CIF" val={formatearMoneda(resultado.base_cif_calculada)} resaltar />
            <Filita etq={`Ad Valorem (${resultado.tasa_advalorem_aplicada.toFixed(2)}%)`} val={formatearMoneda(resultado.valor_advalorem)} />
            {resultado.valor_isc > 0 ? <Filita etq="ISC" val={formatearMoneda(resultado.valor_isc)} /> : null}
            {resultado.valor_igv > 0 ? <Filita etq="IGV (16%)" val={formatearMoneda(resultado.valor_igv)} /> : null}
            {resultado.valor_ipm > 0 ? <Filita etq="IPM (2%)" val={formatearMoneda(resultado.valor_ipm)} /> : null}
            {resultado.valor_percepcion > 0 ? <Filita etq="Percepcion" val={formatearMoneda(resultado.valor_percepcion)} /> : null}
            {resultado.cargo_antidumping > 0 ? <Filita etq="Antidumping" val={formatearMoneda(resultado.cargo_antidumping)} /> : null}
            {resultado.cargo_compensatorio > 0 ? <Filita etq="Compensatorio" val={formatearMoneda(resultado.cargo_compensatorio)} /> : null}
            {resultado.cargo_sda > 0 ? <Filita etq="SDA" val={formatearMoneda(resultado.cargo_sda)} /> : null}
          </TarjetaSeccion>
        ) : (
          <TarjetaSeccion titulo="Tributos">
            <Filita etq="Base FOB" val={formatearMoneda(resultado.base_cif_calculada)} />
            <Filita etq="IGV (16%)" val={formatearMoneda(resultado.valor_igv)} />
            <Filita etq="IPM (2%)" val={formatearMoneda(resultado.valor_ipm)} />
          </TarjetaSeccion>
        )}

        <TarjetaSeccion titulo="Desglose completo" subtitulo="Linea por linea">
          {resultado.desglose.map((l, i) => (
            <View key={i} style={styles.filaDes}>
              <View style={{ flex: 1 }}>
                <Text style={styles.conc}>{l.concepto_tributario}</Text>
                <Text style={styles.subDes}>
                  {l.base_imponible ? `Base ${formatearMoneda(l.base_imponible)}` : ''}
                  {l.tasa_aplicada !== null && l.tasa_aplicada !== undefined ? `   |   ${l.tasa_aplicada.toFixed(2)}%` : ''}
                </Text>
              </View>
              <Text style={styles.valDes}>{formatearMoneda(l.valor_calculado)}</Text>
            </View>
          ))}
        </TarjetaSeccion>

        <BotonContorno
          texto="Ver asiento contable"
          icono="document-text-outline"
          onPress={() => navigation.navigate('AsientoCalculo', { resultado })}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Filita({ etq, val, resaltar }: { etq: string; val: string; resaltar?: boolean }) {
  return (
    <View style={styles.filaInfo}>
      <Text style={styles.etqInfo}>{etq}</Text>
      <Text style={[styles.valInfo, resaltar && { color: tema.primario, fontWeight: '800' }]}>{val}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  totalCard: { backgroundColor: tema.primario, padding: 18, borderRadius: 14, alignItems: 'center', marginBottom: 14 },
  totalEtq: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' },
  totalVal: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 4 },
  filaInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  etqInfo: { color: tema.textoSecundario, fontSize: 12, fontWeight: '600' },
  valInfo: { color: tema.textoPrincipal, fontSize: 13, fontWeight: '700' },
  filaDes: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: tema.bordeClaro },
  conc: { color: tema.textoPrincipal, fontWeight: '700', fontSize: 13 },
  subDes: { color: tema.textoSecundario, fontSize: 11, marginTop: 2 },
  valDes: { color: tema.primario, fontWeight: '800', fontSize: 14 }
});
