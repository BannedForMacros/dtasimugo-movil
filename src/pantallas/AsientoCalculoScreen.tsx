import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import TarjetaSeccion from '../componentes/ui/TarjetaSeccion';
import TablaAsiento from '../componentes/TablaAsiento';
import ConmutadorMoneda from '../componentes/ConmutadorMoneda';
import BotonContorno from '../componentes/ui/BotonContorno';
import BannerInfo from '../componentes/ui/BannerInfo';
import { ResultadoCalculo, AsientoContable, Divisa } from '../tipos';
import { tema } from '../estilos/tema';
import { plantillaPdfAsiento } from '../utilidades/plantilla-pdf-asiento';

// Construye un asiento basico desde un ResultadoCalculo libre, sin necesidad
// de persistir. Usa cuenta 601 (Mercaderias) por defecto cuando no hay
// categoria seleccionada.
function construirAsiento(r: ResultadoCalculo): AsientoContable {
  const round = (n: number) => Math.round(n * 100) / 100;
  const detalles = [] as { cuenta: string; nombre_cuenta: string; debe: number; haber: number }[];

  if (r.modalidad_compra_nacional) {
    const costo = round(r.base_cif_calculada);
    const igvIpm = round(r.valor_igv + r.valor_ipm);
    const total = round(costo + igvIpm);
    detalles.push(
      { cuenta: '601', nombre_cuenta: 'Mercaderias', debe: costo, haber: 0 },
      { cuenta: '4011', nombre_cuenta: 'IGV - Cuenta propia', debe: igvIpm, haber: 0 },
      { cuenta: '4212', nombre_cuenta: 'Facturas por pagar - emitidas', debe: 0, haber: total }
    );
    return {
      glosa: 'Compra nacional simulada',
      moneda: 'USD',
      tipo_cambio: 1,
      detalles,
      total_debe: round(detalles.reduce((s, l) => s + l.debe, 0)),
      total_haber: round(detalles.reduce((s, l) => s + l.haber, 0)),
      diferencia: 0
    };
  }

  const costo = round(r.base_cif_calculada + r.valor_advalorem + r.valor_isc + r.cargo_antidumping + r.cargo_compensatorio + r.cargo_sda);
  const igvIpm = round(r.valor_igv + r.valor_ipm);
  const perc = round(r.valor_percepcion);

  detalles.push(
    { cuenta: '601', nombre_cuenta: 'Mercaderias', debe: costo, haber: 0 },
    { cuenta: '4011', nombre_cuenta: 'IGV - Cuenta propia (importacion)', debe: igvIpm, haber: 0 }
  );
  if (perc > 0) detalles.push({ cuenta: '4015', nombre_cuenta: 'Percepciones del IGV', debe: perc, haber: 0 });
  const total = round(costo + igvIpm + perc);
  detalles.push({ cuenta: '4212', nombre_cuenta: 'Facturas por pagar - importacion', debe: 0, haber: total });

  const td = round(detalles.reduce((s, l) => s + l.debe, 0));
  const th = round(detalles.reduce((s, l) => s + l.haber, 0));

  return {
    glosa: 'Importacion simulada',
    moneda: 'USD',
    tipo_cambio: 1,
    detalles,
    total_debe: td,
    total_haber: th,
    diferencia: round(td - th)
  };
}

export default function AsientoCalculoScreen({ navigation, route }: any) {
  const resultado: ResultadoCalculo = route.params.resultado;
  const [divisa, setDivisa] = useState<Divisa>('USD');
  const asiento = useMemo(() => construirAsiento(resultado), [resultado]);

  const exportarPdf = async () => {
    const html = plantillaPdfAsiento(asiento, 'Asiento contable simulado');
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla
        titulo="Asiento simulado"
        subtitulo="Estimacion sin persistencia"
        onBack={() => navigation.goBack()}
        derecha={<ConmutadorMoneda divisa={divisa} onChange={setDivisa} />}
      />

      <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }}>
        <BannerInfo variante="info" mensaje="El asiento simulado usa cuenta 601 (Mercaderias) por defecto. Para personalizar la cuenta PCGE, registra una operacion dentro de un expediente." />

        <TarjetaSeccion titulo={asiento.glosa}>
          <TablaAsiento asiento={asiento} divisa={divisa} />
        </TarjetaSeccion>

        <BotonContorno texto="Exportar PDF" icono="download-outline" color={tema.secundario} onPress={exportarPdf} />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
