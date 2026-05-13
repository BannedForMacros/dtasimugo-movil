import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../estilos/tema';

type Variante = 'info' | 'advertencia' | 'exito' | 'error';

interface Props {
  mensaje: string;
  variante?: Variante;
}

const ESTILO: Record<Variante, { fondo: string; borde: string; icono: keyof typeof Ionicons.glyphMap; color: string }> = {
  info:         { fondo: '#eff6ff', borde: '#bfdbfe', icono: 'information-circle', color: tema.primario },
  advertencia:  { fondo: '#fffbeb', borde: '#fde68a', icono: 'warning',             color: tema.advertencia },
  exito:        { fondo: '#ecfdf5', borde: '#a7f3d0', icono: 'checkmark-circle',    color: tema.exito },
  error:        { fondo: '#fef2f2', borde: '#fecaca', icono: 'alert-circle',        color: tema.error }
};

export default function BannerInfo({ mensaje, variante = 'info' }: Props) {
  const e = ESTILO[variante];
  return (
    <View style={[styles.cont, { backgroundColor: e.fondo, borderColor: e.borde }]}>
      <Ionicons name={e.icono} size={18} color={e.color} style={{ marginRight: 8 }} />
      <Text style={[styles.texto, { color: e.color }]}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12
  },
  texto: { flex: 1, fontSize: 13, fontWeight: '600' }
});
