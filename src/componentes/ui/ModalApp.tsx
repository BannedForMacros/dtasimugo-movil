import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../../estilos/tema';

interface Props {
  visible: boolean;
  titulo: string;
  subtitulo?: string;
  onCerrar: () => void;
  children: React.ReactNode;
  altura?: 'media' | 'completa';
}

export default function ModalApp({ visible, titulo, subtitulo, onCerrar, children, altura = 'media' }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <View style={styles.overlay}>
        <View style={[styles.tarjeta, altura === 'completa' ? styles.completa : styles.media]}>
          <View style={styles.cabecera}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titulo}>{titulo}</Text>
              {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
            </View>
            <TouchableOpacity onPress={onCerrar} style={styles.cerrar}>
              <Ionicons name="close" size={24} color={tema.textoSecundario} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.contenido}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  tarjeta: { backgroundColor: tema.fondo, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  media: { maxHeight: '70%' },
  completa: { height: '92%' },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: tema.bordeClaro
  },
  titulo: { fontSize: 16, fontWeight: '800', color: tema.primario },
  subtitulo: { fontSize: 12, color: tema.textoSecundario, marginTop: 2 },
  cerrar: { padding: 4 },
  contenido: { padding: 18 }
});
