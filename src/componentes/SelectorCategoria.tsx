import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalApp from './ui/ModalApp';
import BotonSelect from './BotonSelect';
import { obtenerJson } from '../services/cliente-http';
import { tema } from '../estilos/tema';
import { CategoriaMercaderia } from '../tipos';

interface Props {
  etiqueta?: string;
  valor: CategoriaMercaderia | null;
  onChange: (c: CategoriaMercaderia) => void;
}

export default function SelectorCategoria({ etiqueta = 'Categoria de mercaderia', valor, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [lista, setLista] = useState<CategoriaMercaderia[]>([]);

  useEffect(() => {
    if (!abierto || lista.length > 0) return;
    (async () => {
      try {
        const r = await obtenerJson<{ categorias: CategoriaMercaderia[] }>('/api/catalogo/categorias-mercaderia');
        setLista(r.categorias || []);
      } catch {
        setLista([]);
      }
    })();
  }, [abierto, lista.length]);

  const etiquetaBoton = valor ? `${valor.cuenta_pcge} - ${valor.denominacion}` : null;

  return (
    <>
      <BotonSelect etiqueta={etiqueta} valor={etiquetaBoton} onPress={() => setAbierto(true)} />
      <ModalApp visible={abierto} titulo="Categoria PCGE" subtitulo="Cuentas 601 a 604" onCerrar={() => setAbierto(false)}>
        {lista.map((c) => (
          <TouchableOpacity
            key={c.id}
            onPress={() => { onChange(c); setAbierto(false); }}
            style={styles.linea}
          >
            <View style={styles.tarjetaCta}>
              <Text style={styles.cta}>{c.cuenta_pcge}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.den}>{c.denominacion}</Text>
              {c.descripcion_extendida ? <Text style={styles.des}>{c.descripcion_extendida}</Text> : null}
            </View>
          </TouchableOpacity>
        ))}
      </ModalApp>
    </>
  );
}

const styles = StyleSheet.create({
  linea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tema.bordeClaro
  },
  tarjetaCta: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12
  },
  cta: { color: tema.primario, fontWeight: '800', fontSize: 13 },
  den: { color: tema.textoPrincipal, fontWeight: '700', fontSize: 14 },
  des: { color: tema.textoSecundario, fontSize: 12, marginTop: 2 }
});
