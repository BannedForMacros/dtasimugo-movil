import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import ModalTipoCambio from '../componentes/ModalTipoCambio';
import { useSesion } from '../contextos/SesionContext';
import { tema } from '../estilos/tema';

export default function PanelPrincipalScreen({ navigation }: any) {
  const { cuenta, cerrarSesion, cotizacionDia } = useSesion();
  const [verTc, setVerTc] = useState(false);

  const confirmarCerrar = () => {
    Alert.alert('Cerrar sesion', 'Quieres cerrar sesion?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar', style: 'destructive', onPress: cerrarSesion }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla
        titulo="DTASimuGo"
        subtitulo={cuenta?.nombres_completos || ''}
        derecha={
          <TouchableOpacity onPress={confirmarCerrar}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setVerTc(true)} style={styles.tcCard}>
          <View style={styles.tcIcono}>
            <Ionicons name="trending-up" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tcEtq}>Tipo de cambio del dia</Text>
            <Text style={styles.tcVal}>
              {cotizacionDia
                ? `Compra S/ ${cotizacionDia.precio_compra.toFixed(4)} - Venta S/ ${cotizacionDia.precio_venta.toFixed(4)}`
                : 'Sin datos'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.seccion}>Modulos</Text>

        <Tarjeta
          icono="folder-open-outline"
          titulo="Expedientes"
          texto="Crea contenedores y registra tus operaciones de internacion."
          onPress={() => navigation.navigate('ListaExpedientes')}
        />

        <Tarjeta
          icono="calculator-outline"
          titulo="Calculadora tributaria"
          texto="Calcula la deuda aduanera sin registrar operacion. Util para simular."
          onPress={() => navigation.navigate('CalculadoraTributaria')}
        />

        <Text style={styles.pie}>DTASimuGo - Simulador Aduanero</Text>
      </ScrollView>

      <ModalTipoCambio visible={verTc} onCerrar={() => setVerTc(false)} tc={cotizacionDia} />
    </SafeAreaView>
  );
}

function Tarjeta({ icono, titulo, texto, onPress }: { icono: any; titulo: string; texto: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.tarjeta}>
      <View style={styles.tarIcono}>
        <Ionicons name={icono} size={26} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.tarTit}>{titulo}</Text>
        <Text style={styles.tarTxt}>{texto}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tema.textoSecundario} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: tema.secundario,
    borderRadius: 14,
    marginBottom: 18
  },
  tcIcono: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12
  },
  tcEtq: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700' },
  tcVal: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 2 },
  seccion: { color: tema.textoSecundario, fontWeight: '700', marginBottom: 8 },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tema.borde,
    marginBottom: 12
  },
  tarIcono: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: tema.primario,
    alignItems: 'center', justifyContent: 'center', marginRight: 14
  },
  tarTit: { fontSize: 16, fontWeight: '800', color: tema.textoPrincipal },
  tarTxt: { fontSize: 12, color: tema.textoSecundario, marginTop: 2 },
  pie: { textAlign: 'center', color: tema.textoTerciario, fontSize: 11, marginTop: 28 }
});
