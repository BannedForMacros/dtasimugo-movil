import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

interface Props {
  etiqueta?: string;
  valor: string | null;
  placeholder?: string;
  onPress: () => void;
  deshabilitado?: boolean;
}

export default function BotonSelect({ etiqueta, valor, placeholder = 'Seleccionar...', onPress, deshabilitado }: Props) {
  return (
    <View style={styles.cont}>
      {etiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
      <TouchableOpacity
        onPress={onPress}
        disabled={deshabilitado}
        activeOpacity={0.8}
        style={[styles.btn, deshabilitado && { opacity: 0.5 }]}
      >
        <Text style={[styles.valor, !valor && styles.placeholder]} numberOfLines={1}>
          {valor || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={tema.textoSecundario} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cont: { marginBottom: 12 },
  etiqueta: { fontSize: 12, color: tema.textoSecundario, fontWeight: '600', marginBottom: 6 },
  btn: {
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: tema.fondo,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  valor: { fontSize: 15, color: tema.textoPrincipal, flex: 1, marginRight: 8 },
  placeholder: { color: tema.textoTerciario }
});
