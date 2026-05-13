import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../estilos/tema';

interface Props {
  texto: string;
  onPress: () => void;
  deshabilitado?: boolean;
  icono?: keyof typeof Ionicons.glyphMap;
  estilo?: ViewStyle;
  color?: string;
}

export default function BotonContorno({ texto, onPress, deshabilitado, icono, estilo, color }: Props) {
  const c = color || tema.primario;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={deshabilitado}
      style={[styles.boton, { borderColor: c, opacity: deshabilitado ? 0.5 : 1 }, estilo]}
      activeOpacity={0.85}
    >
      {icono ? <Ionicons name={icono} size={16} color={c} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.texto, { color: c }]}>{texto}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'transparent'
  },
  texto: { fontSize: 14, fontWeight: '700' }
});
