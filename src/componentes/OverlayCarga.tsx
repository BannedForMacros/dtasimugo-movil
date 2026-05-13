import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { tema } from '../estilos/tema';

interface Props { visible: boolean; mensaje?: string; }

export default function OverlayCarga({ visible, mensaje = 'Cargando...' }: Props) {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.tarjeta}>
          <ActivityIndicator size="large" color={tema.primario} />
          <Text style={styles.texto}>{mensaje}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.45)', alignItems: 'center', justifyContent: 'center' },
  tarjeta: { backgroundColor: '#fff', padding: 22, borderRadius: 14, alignItems: 'center', minWidth: 180 },
  texto: { marginTop: 12, color: tema.textoPrincipal, fontSize: 14, fontWeight: '600' }
});
