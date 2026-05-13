import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import ModalApp from './ui/ModalApp';
import BotonSelect from './BotonSelect';
import { obtenerJson } from '../services/cliente-http';
import { tema } from '../estilos/tema';
import { PartidaArancelaria } from '../tipos';

interface Props {
  etiqueta?: string;
  valor: PartidaArancelaria | null;
  onChange: (p: PartidaArancelaria) => void;
}

export default function SelectorPartida({ etiqueta = 'Partida arancelaria', valor, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [q, setQ] = useState('');
  const [lista, setLista] = useState<PartidaArancelaria[]>([]);
  const [cargando, setCargando] = useState(false);

  const buscar = useCallback(async (texto: string) => {
    setCargando(true);
    try {
      const r = await obtenerJson<{ partidas: PartidaArancelaria[] }>('/api/catalogo/partidas', { q: texto, limit: 80 });
      setLista(r.partidas || []);
    } catch {
      setLista([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const t = setTimeout(() => buscar(q), 200);
    return () => clearTimeout(t);
  }, [abierto, q, buscar]);

  const seleccionar = (p: PartidaArancelaria) => {
    onChange(p);
    setAbierto(false);
    setQ('');
  };

  const etiquetaBoton = valor ? `${valor.codigo_partida} - ${valor.glosa_oficial}` : null;

  return (
    <>
      <BotonSelect etiqueta={etiqueta} valor={etiquetaBoton} onPress={() => setAbierto(true)} />
      <ModalApp visible={abierto} titulo="Buscar partida" subtitulo="HS-10 con tasa Ad Valorem" onCerrar={() => setAbierto(false)} altura="completa">
        <TextInput
          placeholder="Codigo o descripcion"
          placeholderTextColor={tema.textoTerciario}
          value={q}
          onChangeText={setQ}
          style={styles.buscador}
          autoCapitalize="none"
        />
        {cargando ? <ActivityIndicator color={tema.primario} style={{ marginTop: 12 }} /> : null}
        <FlatList
          data={lista}
          keyExtractor={(it) => it.codigo_partida}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => seleccionar(item)} style={styles.linea}>
              <View style={{ flex: 1 }}>
                <Text style={styles.codigo}>{item.codigo_partida}</Text>
                <Text style={styles.glosa} numberOfLines={2}>{item.glosa_oficial}</Text>
              </View>
              <View style={styles.tarjetaTasa}>
                <Text style={styles.tasa}>{item.tasa_advalorem.toFixed(2)}%</Text>
                <Text style={styles.txtTasa}>Ad Valorem</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={!cargando ? <Text style={styles.vacio}>Sin resultados</Text> : null}
        />
      </ModalApp>
    </>
  );
}

const styles = StyleSheet.create({
  buscador: {
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: tema.textoPrincipal,
    marginBottom: 12
  },
  linea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tema.bordeClaro
  },
  codigo: { color: tema.primario, fontWeight: '800', fontSize: 13 },
  glosa: { color: tema.textoPrincipal, fontSize: 13, marginTop: 2 },
  tarjetaTasa: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginLeft: 10
  },
  tasa: { color: tema.primario, fontWeight: '800', fontSize: 14 },
  txtTasa: { color: tema.textoSecundario, fontSize: 10 },
  vacio: { textAlign: 'center', color: tema.textoSecundario, marginTop: 24 }
});
