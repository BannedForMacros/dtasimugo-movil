import React, { useEffect, useState } from 'react';
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
import { actualizarJson, obtenerJson } from '../services/cliente-http';
import { Operacion, PartidaArancelaria, CategoriaMercaderia } from '../tipos';
import { tema } from '../estilos/tema';

export default function ModificarOperacionScreen({ navigation, route }: any) {
  const operacionInicial: Operacion = route.params.operacion;

  const [esNacional, setEsNacional] = useState(operacionInicial.modalidad_compra_nacional);
  const [partida, setPartida] = useState<PartidaArancelaria | null>(null);
  const [categoria, setCategoria] = useState<CategoriaMercaderia | null>(null);
  const [glosa, setGlosa] = useState(operacionInicial.glosa_producto || '');
  const [fecha, setFecha] = useState(operacionInicial.fecha_internacion);

  const [fob, setFob] = useState(String(operacionInicial.monto_fob_usd));
  const [flete, setFlete] = useState(String(operacionInicial.monto_flete_usd));
  const [seguro, setSeguro] = useState(String(operacionInicial.monto_seguro_usd));

  const [aplicarIgv, setAplicarIgv] = useState(operacionInicial.aplicar_igv);
  const [aplicarIsc, setAplicarIsc] = useState(operacionInicial.aplicar_isc);
  const [aplicarPerc, setAplicarPerc] = useState(operacionInicial.aplicar_percepcion);

  const [tasaAdval, setTasaAdval] = useState(operacionInicial.tasa_advalorem_manual !== null ? String(operacionInicial.tasa_advalorem_manual) : '');
  const [tasaIsc, setTasaIsc] = useState(operacionInicial.tasa_isc_manual !== null ? String(operacionInicial.tasa_isc_manual) : '');
  const [tasaPerc, setTasaPerc] = useState(String(operacionInicial.tasa_percepcion_manual ?? 3.5));

  const [antidumping, setAntidumping] = useState(String(operacionInicial.cargo_antidumping));
  const [compensatorio, setCompensatorio] = useState(String(operacionInicial.cargo_compensatorio));
  const [sda, setSda] = useState(String(operacionInicial.cargo_sda));

  const [guardando, setGuardando] = useState(false);

  // Hidratar partida y categoria iniciales.
  useEffect(() => {
    (async () => {
      try {
        const r = await obtenerJson<{ partidas: PartidaArancelaria[] }>('/api/catalogo/partidas', { q: operacionInicial.codigo_partida, limit: 1 });
        if (r.partidas && r.partidas[0]) setPartida(r.partidas[0]);
        const c = await obtenerJson<{ categorias: CategoriaMercaderia[] }>('/api/catalogo/categorias-mercaderia');
        const enc = (c.categorias || []).find((x) => x.id === operacionInicial.categoria_mercaderia_id);
        if (enc) setCategoria(enc);
      } catch {
        // Ignorar
      }
    })();
  }, [operacionInicial.codigo_partida, operacionInicial.categoria_mercaderia_id]);

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
      await actualizarJson(`/api/operaciones/${operacionInicial.id}`, {
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
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo="Editar operacion" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">

          <TarjetaSeccion titulo="Modalidad">
            <View style={styles.filaSwitch}>
              <View style={{ flex: 1 }}>
                <Text style={styles.swTit}>Compra nacional</Text>
                <Text style={styles.swTxt}>Si activas, solo aplicara IGV + IPM.</Text>
              </View>
              <Switch value={esNacional} onValueChange={setEsNacional} trackColor={{ true: tema.primario, false: tema.borde }} />
            </View>
          </TarjetaSeccion>

          <TarjetaSeccion titulo="Datos del bien">
            <SelectorPartida valor={partida} onChange={setPartida} />
            <SelectorCategoria valor={categoria} onChange={setCategoria} />
            <InputApp etiqueta="Descripcion (opcional)" value={glosa} onChangeText={setGlosa} placeholder="Detalle del producto" />
            <SelectorFecha etiqueta="Fecha de internacion" valor={fecha} onChange={setFecha} maximo={new Date()} />
          </TarjetaSeccion>

          <TarjetaSeccion titulo="Montos (USD)">
            <InputApp etiqueta="FOB" value={fob} onChangeText={setFob} keyboardType="decimal-pad" />
            {!esNacional ? (
              <FilaFormulario>
                <InputApp etiqueta="Flete" value={flete} onChangeText={setFlete} keyboardType="decimal-pad" />
                <InputApp etiqueta="Seguro" value={seguro} onChangeText={setSeguro} keyboardType="decimal-pad" />
              </FilaFormulario>
            ) : null}
          </TarjetaSeccion>

          {!esNacional ? (
            <>
              <TarjetaSeccion titulo="Tributos">
                <View style={styles.filaSwitch}><Text style={styles.swTit}>Aplicar IGV + IPM</Text><Switch value={aplicarIgv} onValueChange={setAplicarIgv} trackColor={{ true: tema.primario, false: tema.borde }} /></View>
                <View style={styles.filaSwitch}><Text style={styles.swTit}>Aplicar ISC</Text><Switch value={aplicarIsc} onValueChange={setAplicarIsc} trackColor={{ true: tema.primario, false: tema.borde }} /></View>
                <View style={styles.filaSwitch}><Text style={styles.swTit}>Aplicar Percepcion</Text><Switch value={aplicarPerc} onValueChange={setAplicarPerc} trackColor={{ true: tema.primario, false: tema.borde }} /></View>
              </TarjetaSeccion>

              <TarjetaSeccion titulo="Tasas">
                <InputApp etiqueta="Ad Valorem" value={tasaAdval} onChangeText={setTasaAdval} keyboardType="decimal-pad" />
                {aplicarIsc ? <InputApp etiqueta="ISC" value={tasaIsc} onChangeText={setTasaIsc} keyboardType="decimal-pad" /> : null}
                {aplicarPerc ? <InputApp etiqueta="Percepcion" value={tasaPerc} onChangeText={setTasaPerc} keyboardType="decimal-pad" /> : null}
              </TarjetaSeccion>

              <TarjetaSeccion titulo="Cargos adicionales">
                <FilaFormulario>
                  <InputApp etiqueta="Antidumping" value={antidumping} onChangeText={setAntidumping} keyboardType="decimal-pad" />
                  <InputApp etiqueta="Compensatorio" value={compensatorio} onChangeText={setCompensatorio} keyboardType="decimal-pad" />
                </FilaFormulario>
                <InputApp etiqueta="SDA" value={sda} onChangeText={setSda} keyboardType="decimal-pad" />
              </TarjetaSeccion>
            </>
          ) : null}

          <BotonPrimario texto="Recalcular y guardar" icono="save-outline" onPress={guardar} cargando={guardando} />
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
