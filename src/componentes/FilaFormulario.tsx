import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props { children: React.ReactNode; espaciado?: number; }

export default function FilaFormulario({ children, espaciado = 10 }: Props) {
  const arr = React.Children.toArray(children);
  return (
    <View style={styles.fila}>
      {arr.map((hijo, i) => (
        <View key={i} style={{ flex: 1, marginRight: i < arr.length - 1 ? espaciado : 0 }}>
          {hijo}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row' }
});
