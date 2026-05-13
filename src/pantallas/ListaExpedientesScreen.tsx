import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import OverlayCarga from '../componentes/OverlayCarga';
import ModalFormularioExpediente from '../componentes/ModalFormularioExpediente';
import { obtenerJson, eliminarJson } from '../services/cliente-http';
import { Expediente } from '../tipos';
import { formatearCorto } from '../utilidades/formato-fecha';
import { tema } from '../estilos/tema';

export default function ListaExpedientesScreen({ navigation }: any) {
  const [lista, setLista] = useState<Expediente[]>([]);
  const [cargando, setCargando] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Expediente | undefined>();

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await obtenerJson<{ expedientes: Expediente[] }>('/api/expedientes');
      setLista(r.expedientes || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const onRefrescar = async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  };

  const eliminar = (exp: Expediente) => {
    Alert.alert('Eliminar expediente', `Marcar "${exp.titulo_expediente}" como eliminado?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await eliminarJson(`/api/expedientes/${exp.id}`);
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
        titulo="Expedientes"
        subtitulo="Contenedores de operaciones de internacion"
        onBack={() => navigation.goBack()}
        derecha={
          <TouchableOpacity onPress={() => { setEnEdicion(undefined); setModalAbierto(true); }}>
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
        ListEmptyComponent={!cargando ? (
          <View style={styles.vacio}>
            <Ionicons name="folder-open-outline" size={50} color={tema.textoTerciario} />
            <Text style={styles.txtVacio}>No hay expedientes. Crea el primero con el boton "+".</Text>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <TouchableOpacity activeOpacity={0.85} style={styles.principal} onPress={() => navigation.navigate('ListaOperaciones', { expediente: item })}>
              <View style={styles.iconoCont}>
                <Ionicons name="folder" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.titulo} numberOfLines={1}>{item.titulo_expediente}</Text>
                {item.observaciones ? <Text style={styles.obs} numberOfLines={2}>{item.observaciones}</Text> : null}
                <View style={styles.metaFila}>
                  <Text style={styles.meta}>Modificado: {formatearCorto(item.modificado_en?.slice(0, 10))}</Text>
                  <View style={styles.tagOps}>
                    <Text style={styles.tagTxt}>{item.operaciones_count || 0} ops</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.acciones}>
              <TouchableOpacity onPress={() => { setEnEdicion(item); setModalAbierto(true); }} style={styles.btnAcc}>
                <Ionicons name="create-outline" size={18} color={tema.primario} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminar(item)} style={styles.btnAcc}>
                <Ionicons name="trash-outline" size={18} color={tema.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <ModalFormularioExpediente
        visible={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        expediente={enEdicion}
        onGuardado={() => cargar()}
      />

      <OverlayCarga visible={cargando && lista.length === 0} mensaje="Cargando expedientes..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tema.borde,
    marginBottom: 12,
    overflow: 'hidden'
  },
  principal: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  iconoCont: { width: 42, height: 42, borderRadius: 10, backgroundColor: tema.primario, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  titulo: { fontSize: 15, fontWeight: '800', color: tema.textoPrincipal },
  obs: { fontSize: 12, color: tema.textoSecundario, marginTop: 2 },
  metaFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  meta: { fontSize: 11, color: tema.textoTerciario },
  tagOps: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  tagTxt: { fontSize: 11, color: tema.primario, fontWeight: '700' },
  acciones: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: tema.bordeClaro, paddingHorizontal: 8, paddingVertical: 4 },
  btnAcc: { padding: 8, marginLeft: 4 },
  vacio: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  txtVacio: { color: tema.textoSecundario, marginTop: 12, textAlign: 'center', paddingHorizontal: 24 }
});
