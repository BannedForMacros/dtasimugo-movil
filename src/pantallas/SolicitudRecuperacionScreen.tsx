import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import InputApp from '../componentes/InputApp';
import BotonPrimario from '../componentes/ui/BotonPrimario';
import BannerInfo from '../componentes/ui/BannerInfo';
import { enviarJson } from '../services/cliente-http';
import { tema } from '../estilos/tema';

export default function SolicitudRecuperacionScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const enviar = async () => {
    if (!correo.trim()) {
      Alert.alert('Validacion', 'Ingresa tu correo.');
      return;
    }
    setCargando(true);
    try {
      await enviarJson('/api/auth/recuperacion', { correo: correo.trim().toLowerCase() });
      setEnviado(true);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo enviar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo="Recuperar clave" subtitulo="Te enviaremos un enlace al correo" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          {enviado ? (
            <BannerInfo
              variante="exito"
              mensaje="Si el correo existe, recibiras un enlace para restablecer tu clave en los proximos minutos."
            />
          ) : (
            <BannerInfo
              variante="info"
              mensaje="Ingresa el correo asociado a tu cuenta. Por seguridad, no confirmaremos si esta registrado."
            />
          )}

          <View style={styles.tarjeta}>
            <InputApp etiqueta="Correo" value={correo} onChangeText={setCorreo} autoCapitalize="none" keyboardType="email-address" placeholder="tucorreo@dominio.com" />
            <BotonPrimario texto="Enviar enlace" onPress={enviar} cargando={cargando} icono="mail-outline" />
          </View>

          <Text style={styles.nota}>Recibiras un correo con un boton para abrir la app y elegir nueva clave.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: '#fff', padding: 18, borderRadius: 14, borderWidth: 1, borderColor: tema.borde },
  nota: { textAlign: 'center', color: tema.textoSecundario, fontSize: 12, marginTop: 16 }
});
