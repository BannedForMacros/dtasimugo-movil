import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import OverlayCarga from '../componentes/OverlayCarga';
import BannerInfo from '../componentes/ui/BannerInfo';
import { obtenerJson, eliminarJson } from '../services/cliente-http';
import { Operacion, Expediente } from '../tipos';
import { tema } from '../estilos/tema';
import { formatearCorto, formatearMoneda } from '../utilidades/formato-fecha';

export default function ListaOperacionesScreen({ navigation, route }: any) {
  const expediente: Expediente = route.params.expediente;

  const [lista, setLista] = useState<Operacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await obtenerJson<{ operaciones: Operacion[] }>('/api/operaciones', { expediente_id: expediente.id });
      setLista(r.operaciones || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  }, [expediente.id]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const onRefrescar = async () => { setRefrescando(true); await cargar(); setRefrescando(false); };

  const eliminar = (op: Operacion) => {
    Alert.alert('Eliminar operacion', `Eliminar la operacion ${op.id.slice(0, 8)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await eliminarJson(`/api/operaciones/${op.id}`);
            await cargar();
          } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.error || 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla
        titulo="Operaciones"
        subtitulo={expediente.titulo_expediente}
        onBack={() => navigation.goBack()}
        derecha={
          <TouchableOpacity onPress={() => navigation.navigate('RegistroOperacion', { expediente })}>
            <Ionicons name="add" size={26} color="#fff" />
          </TouchableOpacity>
        }
      />

      <FlatList
        style={{ backgroundColor: tema.scrollFondo }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        data={lista}
        keyExtractor={(it) => it.id}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefrescar} tintColor={tema.primario} />}
        ListHeaderComponent={
          <BannerInfo
            variante="info"
            mensaje="Cada operacion registra una internacion (importacion) con sus tributos calculados."
          />
        }
        ListEmptyComponent={!cargando ? (
          <View style={styles.vacio}>
            <Ionicons name="layers-outline" size={50} color={tema.textoTerciario} />
            <Text style={styles.txtVacio}>Aun no registras operaciones. Toca "+" para crear la primera.</Text>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} style={styles.tarjeta} onPress={() => navigation.navigate('ConsultaOperacion', { operacionId: item.id })}>
            <View style={styles.cabFila}>
              <View style={styles.tagModo}>
                <Ionicons name={item.modalidad_compra_nacional ? 'home' : 'airplane'} size={12} color="#fff" />
                <Text style={styles.tagTxt}>{item.modalidad_compra_nacional ? 'Nacional' : 'Importacion'}</Text>
              </View>
              <Text style={styles.fecha}>{formatearCorto(item.fecha_internacion)}</Text>
            </View>

            <Text style={styles.partida}>{item.codigo_partida}</Text>
            <Text style={styles.glosa} numberOfLines={2}>{item.glosa_partida || item.glosa_producto || '-'}</Text>

            <View style={styles.fila}>
              <View><Text style={styles.etq}>CIF</Text><Text style={styles.val}>{formatearMoneda(item.base_cif_calculada)}</Text></View>
              <View><Text style={styles.etq}>Total deuda</Text><Text style={[styles.val, { color: tema.secundario }]}>{formatearMoneda(item.total_obligacion_aduanera)}</Text></View>
            </View>

            <View style={styles.acciones}>
              <TouchableOpacity onPress={() => navigation.navigate('ConsultaOperacion', { operacionId: item.id })} style={styles.btnAcc}>
                <Ionicons name="eye-outline" size={18} color={tema.primario} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AsientoOperacion', { operacionId: item.id })} style={styles.btnAcc}>
                <Ionicons name="document-text-outline" size={18} color={tema.primario} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ModificarOperacion', { operacion: item })} style={styles.btnAcc}>
                <Ionicons name="create-outline" size={18} color={tema.secundario} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminar(item)} style={styles.btnAcc}>
                <Ionicons name="trash-outline" size={18} color={tema.error} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <OverlayCarga visible={cargando && lista.length === 0} mensaje="Cargando operaciones..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: tema.borde, padding: 14, marginBottom: 12 },
  cabFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  tagModo: { flexDirection: 'row', alignItems: 'center', backgroundColor: tema.primario, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagTxt: { color: '#fff', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  fecha: { color: tema.textoSecundario, fontSize: 12 },
  partida: { color: tema.primario, fontWeight: '800', fontSize: 14 },
  glosa: { color: tema.textoPrincipal, fontSize: 12, marginTop: 2, marginBottom: 8 },
  fila: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: tema.bordeClaro, paddingTop: 8 },
  etq: { fontSize: 11, color: tema.textoSecundario, fontWeight: '700' },
  val: { fontSize: 14, color: tema.textoPrincipal, fontWeight: '800', marginTop: 2 },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 8 },
  btnAcc: { padding: 6 },
  vacio: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  txtVacio: { color: tema.textoSecundario, marginTop: 12, textAlign: 'center', paddingHorizontal: 24 }
});
