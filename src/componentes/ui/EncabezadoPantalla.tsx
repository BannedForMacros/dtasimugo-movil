import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../estilos/tema';

interface Props {
  titulo: string;
  subtitulo?: string;
  onBack?: () => void;
  derecha?: React.ReactNode;
}

export default function EncabezadoPantalla({ titulo, subtitulo, onBack, derecha }: Props) {
  return (
    <LinearGradient
      colors={[tema.primario, tema.primarioOscuro]}
      style={styles.cont}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.fila}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.boton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : <View style={styles.boton} />}
        <View style={styles.centro}>
          <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
          {subtitulo ? <Text style={styles.subtitulo} numberOfLines={1}>{subtitulo}</Text> : null}
        </View>
        <View style={styles.derecha}>{derecha || null}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cont: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18 },
  fila: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  boton: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  centro: { flex: 1, alignItems: 'center' },
  derecha: { minWidth: 40, alignItems: 'flex-end', justifyContent: 'center' },
  titulo: { color: '#fff', fontSize: 17, fontWeight: '800' },
  subtitulo: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }
});
