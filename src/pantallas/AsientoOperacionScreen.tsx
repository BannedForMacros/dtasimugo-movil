import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import TarjetaSeccion from '../componentes/ui/TarjetaSeccion';
import TablaAsiento from '../componentes/TablaAsiento';
import ConmutadorMoneda from '../componentes/ConmutadorMoneda';
import BotonContorno from '../componentes/ui/BotonContorno';
import OverlayCarga from '../componentes/OverlayCarga';
import BannerInfo from '../componentes/ui/BannerInfo';
import { obtenerJson } from '../services/cliente-http';
import { AsientoContable, Divisa, Operacion } from '../tipos';
import { tema } from '../estilos/tema';
import { plantillaPdfAsiento } from '../utilidades/plantilla-pdf-asiento';

export default function AsientoOperacionScreen({ navigation, route }: any) {
  const operacionId: string = route.params.operacionId;
  const [asiento, setAsiento] = useState<AsientoContable | null>(null);
  const [op, setOp] = useState<Operacion | null>(null);
  const [divisa, setDivisa] = useState<Divisa>('USD');
  const [cargando, setCargando] = useState(false);
  const [exportando, setExportando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const a = await obtenerJson<{ asiento: AsientoContable }>(`/api/operaciones/${operacionId}/asiento`);
      const b = await obtenerJson<{ operacion: Operacion }>(`/api/operaciones/${operacionId}`);
      setAsiento(a.asiento);
      setOp(b.operacion);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  }, [operacionId]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const convertir = (a: AsientoContable): AsientoContable => {
    if (divisa === 'USD') return a;
    const tc = a.tipo_cambio || 1;
    const r = (n: number) => Math.round(n * tc * 100) / 100;
    const detalles = a.detalles.map((l) => ({ ...l, debe: r(l.debe), haber: r(l.haber) }));
    const td = Math.round(detalles.reduce((s, l) => s + l.debe, 0) * 100) / 100;
    const th = Math.round(detalles.reduce((s, l) => s + l.haber, 0) * 100) / 100;
    return { ...a, moneda: 'PEN', detalles, total_debe: td, total_haber: th, diferencia: Math.round((td - th) * 100) / 100 };
  };

  const asientoMostrar = asiento ? convertir(asiento) : null;

  const exportarPdf = async () => {
    if (!asientoMostrar) return;
    setExportando(true);
    try {
      const html = plantillaPdfAsiento(asientoMostrar, 'Asiento contable de operacion');
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo generar el PDF');
    } finally {
      setExportando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla
        titulo="Asiento contable"
        subtitulo={op?.codigo_partida}
        onBack={() => navigation.goBack()}
        derecha={<ConmutadorMoneda divisa={divisa} onChange={setDivisa} />}
      />

      <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }}>
        {asientoMostrar ? (
          <>
            <BannerInfo
              variante="info"
              mensaje={`Tipo de cambio: S/ ${(asiento?.tipo_cambio || 1).toFixed(4)}. Moneda mostrada: ${asientoMostrar.moneda}.`}
            />

            <TarjetaSeccion titulo={asientoMostrar.glosa}>
              <TablaAsiento asiento={asientoMostrar} divisa={divisa} />
            </TarjetaSeccion>

            <BotonContorno texto="Exportar PDF" icono="download-outline" color={tema.secundario} onPress={exportarPdf} />
          </>
        ) : null}
        <View style={{ height: 32 }} />
      </ScrollView>

      <OverlayCarga visible={cargando || exportando} mensaje={exportando ? 'Generando PDF...' : 'Cargando...'} />
    </SafeAreaView>
  );
}
