import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import TarjetaSeccion from '../componentes/ui/TarjetaSeccion';
import BotonContorno from '../componentes/ui/BotonContorno';
import OverlayCarga from '../componentes/OverlayCarga';
import { obtenerJson } from '../services/cliente-http';
import { Operacion, LineaDesglose } from '../tipos';
import { tema } from '../estilos/tema';
import { formatearLargo, formatearMoneda } from '../utilidades/formato-fecha';
import { plantillaPdfOperacion } from '../utilidades/plantilla-pdf-operacion';

export default function ConsultaOperacionScreen({ navigation, route }: any) {
  const operacionId: string = route.params.operacionId;
  const [op, setOp] = useState<Operacion | null>(null);
  const [desglose, setDesglose] = useState<LineaDesglose[]>([]);
  const [cargando, setCargando] = useState(false);
  const [exportando, setExportando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const a = await obtenerJson<{ operacion: Operacion }>(`/api/operaciones/${operacionId}`);
      const b = await obtenerJson<{ desglose: LineaDesglose[] }>(`/api/operaciones/${operacionId}/desglose`);
      setOp(a.operacion);
      setDesglose(b.desglose || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  }, [operacionId]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const exportarPdf = async () => {
    if (!op) return;
    setExportando(true);
    try {
      const html = plantillaPdfOperacion(op, desglose);
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo generar el PDF');
    } finally {
      setExportando(false);
    }
  };

  if (!op) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
        <EncabezadoPantalla titulo="Operacion" onBack={() => navigation.goBack()} />
        <OverlayCarga visible={cargando} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla
        titulo="Operacion"
        subtitulo={op.codigo_partida}
        onBack={() => navigation.goBack()}
        derecha={
          <TouchableOpacity onPress={() => navigation.navigate('ModificarOperacion', { operacion: op })}>
            <Ionicons name="create-outline" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.totalCard}>
          <Text style={styles.totalEtq}>Obligacion tributaria aduanera</Text>
          <Text style={styles.totalVal}>{formatearMoneda(op.total_obligacion_aduanera)}</Text>
          <Text style={styles.totalSub}>{op.modalidad_compra_nacional ? 'Compra nacional' : 'Importacion'}</Text>
        </View>

        <TarjetaSeccion titulo="Datos generales">
          <Filita etq="Partida" val={op.codigo_partida} />
          <Filita etq="Descripcion partida" val={op.glosa_partida || '-'} />
          <Filita etq="Categoria PCGE" val={op.cuenta_pcge ? `${op.cuenta_pcge} - ${op.denominacion_categoria}` : '-'} />
          <Filita etq="Fecha internacion" val={formatearLargo(op.fecha_internacion)} />
        </TarjetaSeccion>

        <TarjetaSeccion titulo="Montos base">
          <Filita etq="FOB" val={formatearMoneda(op.monto_fob_usd)} />
          {!op.modalidad_compra_nacional ? (
            <>
              <Filita etq="Flete" val={formatearMoneda(op.monto_flete_usd)} />
              <Filita etq="Seguro" val={formatearMoneda(op.monto_seguro_usd)} />
              <Filita etq="CIF calculado" val={formatearMoneda(op.base_cif_calculada)} resaltar />
            </>
          ) : null}
        </TarjetaSeccion>

        <TarjetaSeccion titulo="Desglose tributario">
          <View style={styles.cabFila}>
            <Text style={[styles.col, { flex: 1 }]}>Concepto</Text>
            <Text style={[styles.col, styles.right]}>Base</Text>
            <Text style={[styles.col, styles.right]}>Tasa</Text>
            <Text style={[styles.col, styles.right]}>Valor</Text>
          </View>
          {desglose.map((l, i) => (
            <View key={i} style={styles.filaDes}>
              <Text style={[styles.col, { flex: 1, color: tema.textoPrincipal }]}>{l.concepto_tributario}</Text>
              <Text style={[styles.col, styles.right, { color: tema.textoSecundario }]}>{l.base_imponible ? formatearMoneda(l.base_imponible) : '-'}</Text>
              <Text style={[styles.col, styles.right, { color: tema.textoSecundario }]}>{l.tasa_aplicada !== null && l.tasa_aplicada !== undefined ? `${l.tasa_aplicada.toFixed(2)}%` : '-'}</Text>
              <Text style={[styles.col, styles.right, { color: tema.primario, fontWeight: '800' }]}>{formatearMoneda(l.valor_calculado)}</Text>
            </View>
          ))}
        </TarjetaSeccion>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <BotonContorno texto="Ver asiento" icono="document-text-outline" onPress={() => navigation.navigate('AsientoOperacion', { operacionId: op.id })} />
          </View>
          <View style={{ flex: 1 }}>
            <BotonContorno texto="Exportar PDF" icono="download-outline" color={tema.secundario} onPress={exportarPdf} />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <OverlayCarga visible={cargando || exportando} mensaje={exportando ? 'Generando PDF...' : 'Cargando...'} />
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
  totalSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  filaInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  etqInfo: { color: tema.textoSecundario, fontSize: 12, fontWeight: '600' },
  valInfo: { color: tema.textoPrincipal, fontSize: 13, fontWeight: '600', textAlign: 'right', flexShrink: 1, marginLeft: 12 },
  cabFila: { flexDirection: 'row', paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: tema.borde, marginBottom: 4 },
  col: { color: tema.textoSecundario, fontWeight: '700', fontSize: 11, width: 76 },
  right: { textAlign: 'right' },
  filaDes: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: tema.bordeClaro }
});
