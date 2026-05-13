import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import TarjetaSeccion from '../componentes/ui/TarjetaSeccion';
import InputApp from '../componentes/InputApp';
import BotonPrimario from '../componentes/ui/BotonPrimario';
import SelectorPartida from '../componentes/SelectorPartida';
import SelectorCategoria from '../componentes/SelectorCategoria';
import SelectorFecha from '../componentes/SelectorFecha';
import FilaFormulario from '../componentes/FilaFormulario';
import { enviarJson } from '../services/cliente-http';
import { Expediente, PartidaArancelaria, CategoriaMercaderia, Operacion } from '../tipos';
import { fechaHoyIso } from '../utilidades/formato-fecha';
import { tema } from '../estilos/tema';

export default function RegistroOperacionScreen({ navigation, route }: any) {
  const expediente: Expediente = route.params.expediente;

  const [esNacional, setEsNacional] = useState(false);
  const [partida, setPartida] = useState<PartidaArancelaria | null>(null);
  const [categoria, setCategoria] = useState<CategoriaMercaderia | null>(null);
  const [glosa, setGlosa] = useState('');
  const [fecha, setFecha] = useState(fechaHoyIso());

  const [fob, setFob] = useState('');
  const [flete, setFlete] = useState('0');
  const [seguro, setSeguro] = useState('0');

  const [aplicarIgv, setAplicarIgv] = useState(true);
  const [aplicarIsc, setAplicarIsc] = useState(false);
  const [aplicarPerc, setAplicarPerc] = useState(true);

  const [tasaAdval, setTasaAdval] = useState('');
  const [tasaIsc, setTasaIsc] = useState('');
  const [tasaPerc, setTasaPerc] = useState('3.5');

  const [antidumping, setAntidumping] = useState('0');
  const [compensatorio, setCompensatorio] = useState('0');
  const [sda, setSda] = useState('0');

  const [guardando, setGuardando] = useState(false);

  const num = (s: string) => {
    const v = parseFloat(s.replace(',', '.'));
    return Number.isFinite(v) ? v : 0;
  };

  const guardar = async () => {
    if (!partida) { Alert.alert('Validacion', 'Selecciona una partida.'); return; }
    if (!categoria) { Alert.alert('Validacion', 'Selecciona una categoria PCGE.'); return; }
    if (num(fob) <= 0) { Alert.alert('Validacion', 'El monto FOB debe ser mayor a 0.'); return; }

    setGuardando(true);
    try {
      const r = await enviarJson<{ operacion: Operacion }>('/api/operaciones', {
        expediente_id: expediente.id,
        modalidad_compra_nacional: esNacional,
        categoria_mercaderia_id: categoria.id,
        codigo_partida: partida.codigo_partida,
        glosa_producto: glosa.trim() || null,
        monto_fob_usd: num(fob),
        monto_flete_usd: num(flete),
        monto_seguro_usd: num(seguro),
        aplicar_igv: aplicarIgv,
        aplicar_isc: aplicarIsc,
        aplicar_percepcion: aplicarPerc,
        tasa_advalorem_manual: tasaAdval ? num(tasaAdval) : null,
        tasa_isc_manual: aplicarIsc && tasaIsc ? num(tasaIsc) : null,
        tasa_percepcion_manual: aplicarPerc ? num(tasaPerc) : 0,
        cargo_antidumping: num(antidumping),
        cargo_compensatorio: num(compensatorio),
        cargo_sda: num(sda),
        fecha_internacion: fecha
      });
      navigation.replace('ConsultaOperacion', { operacionId: r.operacion.id });
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo="Nueva operacion" subtitulo={expediente.titulo_expediente} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">

          <TarjetaSeccion titulo="Modalidad">
            <View style={styles.filaSwitch}>
              <View style={{ flex: 1 }}>
                <Text style={styles.swTit}>Compra nacional</Text>
                <Text style={styles.swTxt}>Si activas, solo aplicara IGV + IPM sobre el FOB. Sin tributos aduaneros.</Text>
              </View>
              <Switch value={esNacional} onValueChange={setEsNacional} trackColor={{ true: tema.primario, false: tema.borde }} />
            </View>
          </TarjetaSeccion>

          <TarjetaSeccion titulo="Datos del bien">
            <SelectorPartida valor={partida} onChange={(p) => { setPartida(p); setTasaAdval(p.tasa_advalorem.toFixed(2)); }} />
            <SelectorCategoria valor={categoria} onChange={setCategoria} />
            <InputApp etiqueta="Descripcion (opcional)" value={glosa} onChangeText={setGlosa} placeholder="Detalle del producto" />
            <SelectorFecha etiqueta="Fecha de internacion" valor={fecha} onChange={setFecha} maximo={new Date()} />
          </TarjetaSeccion>

          <TarjetaSeccion titulo="Montos (USD)">
            <InputApp etiqueta="FOB" value={fob} onChangeText={setFob} keyboardType="decimal-pad" placeholder="0.00" />
            {!esNacional ? (
              <FilaFormulario>
                <InputApp etiqueta="Flete" value={flete} onChangeText={setFlete} keyboardType="decimal-pad" />
                <InputApp etiqueta="Seguro" value={seguro} onChangeText={setSeguro} keyboardType="decimal-pad" />
              </FilaFormulario>
            ) : null}
          </TarjetaSeccion>

          {!esNacional ? (
            <>
              <TarjetaSeccion titulo="Tributos aplicables">
                <View style={styles.filaSwitch}>
                  <Text style={styles.swTit}>Aplicar IGV + IPM</Text>
                  <Switch value={aplicarIgv} onValueChange={setAplicarIgv} trackColor={{ true: tema.primario, false: tema.borde }} />
                </View>
                <View style={styles.filaSwitch}>
                  <Text style={styles.swTit}>Aplicar ISC</Text>
                  <Switch value={aplicarIsc} onValueChange={setAplicarIsc} trackColor={{ true: tema.primario, false: tema.borde }} />
                </View>
                <View style={styles.filaSwitch}>
                  <Text style={styles.swTit}>Aplicar Percepcion</Text>
                  <Switch value={aplicarPerc} onValueChange={setAplicarPerc} trackColor={{ true: tema.primario, false: tema.borde }} />
                </View>
              </TarjetaSeccion>

              <TarjetaSeccion titulo="Tasas (porcentaje)">
                <InputApp etiqueta="Ad Valorem" value={tasaAdval} onChangeText={setTasaAdval} keyboardType="decimal-pad" placeholder="Se autocompleta segun partida" />
                {aplicarIsc ? <InputApp etiqueta="ISC" value={tasaIsc} onChangeText={setTasaIsc} keyboardType="decimal-pad" placeholder="Ej. 17" /> : null}
                {aplicarPerc ? <InputApp etiqueta="Percepcion" value={tasaPerc} onChangeText={setTasaPerc} keyboardType="decimal-pad" placeholder="3.5 / 5 / 10" /> : null}
              </TarjetaSeccion>

              <TarjetaSeccion titulo="Cargos adicionales (USD)">
                <FilaFormulario>
                  <InputApp etiqueta="Antidumping" value={antidumping} onChangeText={setAntidumping} keyboardType="decimal-pad" />
                  <InputApp etiqueta="Compensatorio" value={compensatorio} onChangeText={setCompensatorio} keyboardType="decimal-pad" />
                </FilaFormulario>
                <InputApp etiqueta="SDA" value={sda} onChangeText={setSda} keyboardType="decimal-pad" />
              </TarjetaSeccion>
            </>
          ) : null}

          <BotonPrimario texto="Calcular y guardar" icono="calculator-outline" onPress={guardar} cargando={guardando} estilo={{ marginTop: 4 }} />
          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filaSwitch: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  swTit: { fontSize: 14, color: tema.textoPrincipal, fontWeight: '700' },
  swTxt: { fontSize: 11, color: tema.textoSecundario, marginTop: 2 }
});
