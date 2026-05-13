import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { tema } from '../estilos/tema';

interface Props extends TextInputProps {
  etiqueta?: string;
  error?: string;
  estiloCont?: ViewStyle;
}

export default function InputApp({ etiqueta, error, estiloCont, style, ...rest }: Props) {
  return (
    <View style={[styles.cont, estiloCont]}>
      {etiqueta ? <Text style={styles.etiqueta}>{etiqueta}</Text> : null}
      <TextInput
        {...rest}
        placeholderTextColor={tema.textoTerciario}
        style={[styles.input, error ? styles.error : null, style]}
      />
      {error ? <Text style={styles.txtError}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cont: { marginBottom: 12 },
  etiqueta: { fontSize: 12, color: tema.textoSecundario, fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: tema.textoPrincipal,
    backgroundColor: tema.fondo
  },
  error: { borderColor: tema.error },
  txtError: { color: tema.error, fontSize: 12, marginTop: 4 }
});
