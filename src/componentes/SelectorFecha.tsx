import React, { useState } from 'react';
import { Platform, TouchableOpacity, Text, View, StyleSheet, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';
import { fechaToIso, isoToFecha, formatearCorto } from '../utilidades/formato-fecha';

interface Props {
  etiqueta?: string;
  valor: string;
  onChange: (iso: string) => void;
  minimo?: Date;
  maximo?: Date;
}

export default function SelectorFecha({ etiqueta, valor, onChange, minimo, maximo }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [tmp, setTmp] = useState<Date | null>(null);

  const onCambio = (_e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === 'android') {
      setAbierto(false);
      if (d) onChange(fechaToIso(d));
    } else {
      if (d) setTmp(d);
    }
  };

  const confirmar = () => {
    if (tmp) onChange(fechaToIso(tmp));
    setAbierto(false);
    setTmp(null);
  };

  return (
    <View style={styles.cont}>
      {etiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
      <TouchableOpacity onPress={() => setAbierto(true)} activeOpacity={0.8} style={styles.btn}>
        <Text style={styles.valor}>{formatearCorto(valor) || 'Seleccionar fecha'}</Text>
        <Ionicons name="calendar" size={18} color={tema.primario} />
      </TouchableOpacity>

      {Platform.OS === 'android' && abierto ? (
        <DateTimePicker
          value={isoToFecha(valor)}
          mode="date"
          display="default"
          onChange={onCambio}
          minimumDate={minimo}
          maximumDate={maximo}
        />
      ) : null}

      {Platform.OS === 'ios' && abierto ? (
        <Modal transparent visible={abierto} animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <DateTimePicker
                value={tmp || isoToFecha(valor)}
                mode="date"
                display="spinner"
                onChange={onCambio}
                minimumDate={minimo}
                maximumDate={maximo}
              />
              <View style={styles.filaBtns}>
                <TouchableOpacity onPress={() => { setAbierto(false); setTmp(null); }} style={[styles.btnAccion, { borderColor: tema.acento }]}>
                  <Text style={[styles.txtAccion, { color: tema.acento }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmar} style={[styles.btnAccion, { backgroundColor: tema.primario, borderColor: tema.primario }]}>
                  <Text style={[styles.txtAccion, { color: '#fff' }]}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
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
  valor: { fontSize: 15, color: tema.textoPrincipal },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 14, padding: 16, width: '85%' },
  filaBtns: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 8 },
  btnAccion: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5 },
  txtAccion: { fontWeight: '700', fontSize: 13 }
});
