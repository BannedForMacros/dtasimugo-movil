import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import InputApp from '../componentes/InputApp';
import BotonPrimario from '../componentes/ui/BotonPrimario';
import BannerInfo from '../componentes/ui/BannerInfo';
import { enviarJson } from '../services/cliente-http';
import { tema } from '../estilos/tema';

export default function NuevaClaveScreen({ navigation, route }: any) {
  const tokenInicial = route?.params?.token || '';
  const [token, setToken] = useState(tokenInicial);
  const [clave, setClave] = useState('');
  const [conf, setConf] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (route?.params?.token) setToken(route.params.token);
  }, [route?.params?.token]);

  const enviar = async () => {
    if (!token || token.length !== 64) {
      Alert.alert('Validacion', 'Pega o abre el enlace con un token valido (64 caracteres).');
      return;
    }
    if (clave.length < 8) {
      Alert.alert('Validacion', 'La nueva clave debe tener al menos 8 caracteres.');
      return;
    }
    if (clave !== conf) {
      Alert.alert('Validacion', 'Las claves no coinciden.');
      return;
    }

    setCargando(true);
    try {
      await enviarJson('/api/auth/nueva-clave', { token, nueva_clave: clave });
      Alert.alert('Listo', 'Clave actualizada. Inicia sesion con tu nueva clave.', [
        { text: 'Ir a Ingresar', onPress: () => navigation.replace('Ingreso') }
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo actualizar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo="Nueva clave" subtitulo="Aplica el token recibido por correo" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <BannerInfo
            variante="info"
            mensaje="Si llegaste aqui desde el correo, el token ya esta colocado automaticamente."
          />

          <View style={styles.tarjeta}>
            <InputApp etiqueta="Token (64 caracteres)" value={token} onChangeText={setToken} autoCapitalize="none" placeholder="Token recibido por correo" />

            <View>
              <InputApp etiqueta="Nueva clave" value={clave} onChangeText={setClave} secureTextEntry={!verClave} placeholder="Minimo 8 caracteres" />
              <TouchableOpacity style={styles.ojo} onPress={() => setVerClave(!verClave)}>
                <Ionicons name={verClave ? 'eye-off' : 'eye'} size={20} color={tema.textoSecundario} />
              </TouchableOpacity>
            </View>

            <InputApp etiqueta="Confirmar nueva clave" value={conf} onChangeText={setConf} secureTextEntry={!verClave} placeholder="Repite la clave" />

            <BotonPrimario texto="Actualizar clave" onPress={enviar} cargando={cargando} icono="key-outline" />
          </View>

          <Text style={styles.nota}>Al actualizar tu clave se cerraran todas tus sesiones activas.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#fff', padding: 18, borderRadius: 14, borderWidth: 1, borderColor: tema.borde },
  ojo: { position: 'absolute', right: 12, top: 32 },
  nota: { textAlign: 'center', color: tema.textoSecundario, fontSize: 12, marginTop: 16 }
});
