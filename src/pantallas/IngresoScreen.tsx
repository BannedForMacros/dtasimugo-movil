import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import InputApp from '../componentes/InputApp';
import BotonPrimario from '../componentes/ui/BotonPrimario';
import { useSesion } from '../contextos/SesionContext';
import { tema } from '../estilos/tema';

export default function IngresoScreen({ navigation }: any) {
  const { iniciarSesion } = useSesion();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  const ingresar = async () => {
    if (!correo.trim() || !clave) {
      Alert.alert('Validacion', 'Completa correo y clave.');
      return;
    }
    setCargando(true);
    try {
      await iniciarSesion(correo, clave);
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'No se pudo iniciar sesion';
      Alert.alert('Error', msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.cont} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.heroe}>
            <View style={styles.logo}>
              <Ionicons name="cube" size={48} color="#fff" />
            </View>
            <Text style={styles.marca}>DTASimuGo</Text>
            <Text style={styles.tag}>Calcula tu deuda tributaria aduanera al instante</Text>
          </View>

          <View style={styles.tarjeta}>
            <Text style={styles.titulo}>Iniciar sesion</Text>
            <Text style={styles.subt}>Ingresa con tu correo y clave</Text>

            <InputApp
              etiqueta="Correo"
              value={correo}
              onChangeText={setCorreo}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="tucorreo@dominio.com"
            />

            <View style={{ marginBottom: 12 }}>
              <InputApp
                etiqueta="Clave"
                value={clave}
                onChangeText={setClave}
                secureTextEntry={!verClave}
                placeholder="Tu clave"
              />
              <TouchableOpacity style={styles.ojo} onPress={() => setVerClave(!verClave)}>
                <Ionicons name={verClave ? 'eye-off' : 'eye'} size={20} color={tema.textoSecundario} />
              </TouchableOpacity>
            </View>

            <BotonPrimario texto="Ingresar" onPress={ingresar} cargando={cargando} icono="log-in-outline" />

            <TouchableOpacity onPress={() => navigation.navigate('SolicitudRecuperacion')} style={styles.lnkRecuperar}>
              <Text style={styles.txtLink}>Olvide mi clave</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filaRegistro}>
            <Text style={styles.txtSec}>No tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
              <Text style={[styles.txtLink, { marginLeft: 6 }]}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cont: { flex: 1, backgroundColor: tema.primario },
  scroll: { flexGrow: 1, padding: 20 },
  heroe: { alignItems: 'center', marginTop: 20, marginBottom: 28 },
  logo: { width: 86, height: 86, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  marca: { fontSize: 28, color: '#fff', fontWeight: '800' },
  tag: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: 'center' },
  tarjeta: { backgroundColor: '#fff', padding: 22, borderRadius: 18 },
  titulo: { fontSize: 20, fontWeight: '800', color: tema.primario },
  subt: { fontSize: 12, color: tema.textoSecundario, marginBottom: 18, marginTop: 2 },
  ojo: { position: 'absolute', right: 12, top: 32 },
  lnkRecuperar: { alignItems: 'center', marginTop: 12 },
  txtLink: { color: tema.secundario, fontWeight: '700' },
  txtSec: { color: 'rgba(255,255,255,0.85)' },
  filaRegistro: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 }
});
