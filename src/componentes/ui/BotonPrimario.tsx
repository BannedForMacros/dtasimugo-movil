import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../estilos/tema';

interface Props {
  texto: string;
  onPress: () => void;
  cargando?: boolean;
  deshabilitado?: boolean;
  icono?: keyof typeof Ionicons.glyphMap;
  estilo?: ViewStyle;
  variante?: 'primario' | 'secundario' | 'peligro';
}

export default function BotonPrimario({ texto, onPress, cargando, deshabilitado, icono, estilo, variante = 'primario' }: Props) {
  const disabled = !!(cargando || deshabilitado);
  const colorFondo =
    variante === 'secundario' ? tema.secundario :
    variante === 'peligro' ? tema.error :
    tema.primario;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.boton, { backgroundColor: colorFondo, opacity: disabled ? 0.55 : 1 }, estilo]}
      activeOpacity={0.85}
    >
      {cargando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icono ? <Ionicons name={icono} size={18} color="#fff" style={{ marginRight: 8 }} /> : null}
          <Text style={styles.texto}>{texto}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18
  },
  texto: { color: '#fff', fontSize: 15, fontWeight: '700' }
});
