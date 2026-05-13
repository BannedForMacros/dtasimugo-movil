import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import InputApp from '../componentes/InputApp';
import BotonPrimario from '../componentes/ui/BotonPrimario';
import { useSesion } from '../contextos/SesionContext';
import { tema } from '../estilos/tema';

export default function RegistroScreen({ navigation }: any) {
  const { registrar, iniciarSesion } = useSesion();

  const [correo, setCorreo] = useState('');
  const [nombres, setNombres] = useState('');
  const [alias, setAlias] = useState('');
  const [clave, setClave] = useState('');
  const [conf, setConf] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    if (!correo.trim() || !nombres.trim() || !clave) {
      Alert.alert('Validacion', 'Completa correo, nombres y clave.');
      return;
    }
    if (clave.length < 8) {
      Alert.alert('Validacion', 'La clave debe tener al menos 8 caracteres.');
      return;
    }
    if (clave !== conf) {
      Alert.alert('Validacion', 'Las claves no coinciden.');
      return;
    }
    setCargando(true);
    try {
      await registrar({ correo, nombres_completos: nombres, alias: alias || undefined, clave });
      await iniciarSesion(correo, clave);
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'No se pudo registrar';
      Alert.alert('Error', msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo="Crear cuenta" subtitulo="Acceso a DTASimuGo" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" style={styles.fondo}>
          <View style={styles.tarjeta}>
            <InputApp etiqueta="Correo"   value={correo}  onChangeText={setCorreo}  autoCapitalize="none" keyboardType="email-address" placeholder="tucorreo@dominio.com" />
            <InputApp etiqueta="Nombres completos" value={nombres} onChangeText={setNombres} placeholder="Nombres y apellidos" />
            <InputApp etiqueta="Alias (opcional)" value={alias} onChangeText={setAlias} placeholder="Como te llamamos" />

            <View>
              <InputApp etiqueta="Clave" value={clave} onChangeText={setClave} secureTextEntry={!verClave} placeholder="Minimo 8 caracteres" />
              <TouchableOpacity style={styles.ojo} onPress={() => setVerClave(!verClave)}>
                <Ionicons name={verClave ? 'eye-off' : 'eye'} size={20} color={tema.textoSecundario} />
              </TouchableOpacity>
            </View>

            <InputApp etiqueta="Confirmar clave" value={conf} onChangeText={setConf} secureTextEntry={!verClave} placeholder="Repite la clave" />

            <BotonPrimario texto="Crear cuenta" onPress={enviar} cargando={cargando} icono="person-add-outline" />
            <Text style={styles.notaSeg}>Tu clave se almacena cifrada con Argon2id.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fondo: { backgroundColor: tema.scrollFondo },
  scroll: { flexGrow: 1, padding: 16 },
  tarjeta: { backgroundColor: '#fff', padding: 18, borderRadius: 14, borderWidth: 1, borderColor: tema.borde },
  ojo: { position: 'absolute', right: 12, top: 32 },
  notaSeg: { textAlign: 'center', color: tema.textoTerciario, fontSize: 11, marginTop: 12 }
});
