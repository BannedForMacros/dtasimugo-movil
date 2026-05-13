import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { tema } from '../../estilos/tema';

interface Props {
  titulo?: string;
  subtitulo?: string;
  children: React.ReactNode;
  estilo?: ViewStyle;
}

export default function TarjetaSeccion({ titulo, subtitulo, children, estilo }: Props) {
  return (
    <View style={[styles.cont, estilo]}>
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    backgroundColor: tema.fondo,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: tema.borde
  },
  titulo: { fontSize: 15, fontWeight: '800', color: tema.primario, marginBottom: 2 },
  subtitulo: { fontSize: 12, color: tema.textoSecundario, marginBottom: 12 }
});
