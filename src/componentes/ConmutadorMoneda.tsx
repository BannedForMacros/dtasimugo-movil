import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tema } from '../estilos/tema';
import { Divisa } from '../tipos';

interface Props {
  divisa: Divisa;
  onChange: (d: Divisa) => void;
}

export default function ConmutadorMoneda({ divisa, onChange }: Props) {
  return (
    <View style={styles.cont}>
      {(['USD', 'PEN'] as Divisa[]).map((d) => {
        const activa = d === divisa;
        return (
          <TouchableOpacity
            key={d}
            onPress={() => onChange(d)}
            style={[styles.btn, activa ? styles.activo : styles.inactivo]}
          >
            <Text style={[styles.txt, activa ? styles.txtActivo : styles.txtInactivo]}>{d}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cont: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 2 },
  btn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  activo: { backgroundColor: '#fff' },
  inactivo: { backgroundColor: 'transparent' },
  txt: { fontSize: 12, fontWeight: '700' },
  txtActivo: { color: tema.primario },
  txtInactivo: { color: 'rgba(255,255,255,0.85)' }
});
