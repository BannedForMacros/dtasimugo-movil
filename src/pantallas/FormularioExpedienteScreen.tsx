import React, { useState } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EncabezadoPantalla from '../componentes/ui/EncabezadoPantalla';
import InputApp from '../componentes/InputApp';
import BotonPrimario from '../componentes/ui/BotonPrimario';
import TarjetaSeccion from '../componentes/ui/TarjetaSeccion';
import { enviarJson, actualizarJson } from '../services/cliente-http';
import { Expediente } from '../tipos';
import { tema } from '../estilos/tema';

// Pantalla alternativa al modal: util para abrir desde un deep link o un boton de "ver mas".
export default function FormularioExpedienteScreen({ navigation, route }: any) {
  const exp: Expediente | undefined = route?.params?.expediente;
  const [titulo, setTitulo] = useState(exp?.titulo_expediente || '');
  const [obs, setObs] = useState(exp?.observaciones || '');
  const [cargando, setCargando] = useState(false);

  const guardar = async () => {
    if (titulo.trim().length < 2) {
      Alert.alert('Validacion', 'Titulo de al menos 2 caracteres.');
      return;
    }
    setCargando(true);
    try {
      const cuerpo = { titulo_expediente: titulo.trim(), observaciones: obs.trim() || null };
      if (exp) await actualizarJson(`/api/expedientes/${exp.id}`, cuerpo);
      else await enviarJson('/api/expedientes', cuerpo);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.primario }} edges={['top']}>
      <EncabezadoPantalla titulo={exp ? 'Editar expediente' : 'Nuevo expediente'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ backgroundColor: tema.scrollFondo }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <TarjetaSeccion titulo="Datos" subtitulo="Contenedor de operaciones de internacion">
            <InputApp etiqueta="Titulo" value={titulo} onChangeText={setTitulo} maxLength={180} placeholder="Ej. Importacion electronicos 2026" />
            <InputApp
              etiqueta="Observaciones (opcional)"
              value={obs}
              onChangeText={setObs}
              placeholder="Notas internas"
              multiline
              numberOfLines={4}
              style={{ minHeight: 96, textAlignVertical: 'top' }}
            />
            <BotonPrimario texto={exp ? 'Guardar cambios' : 'Crear expediente'} icono="save-outline" onPress={guardar} cargando={cargando} />
          </TarjetaSeccion>

          <Text style={styles.nota}>Solo agrupa importaciones. Aqui no se registran exportaciones ni gastos.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nota: { textAlign: 'center', color: tema.textoTerciario, fontSize: 11, marginTop: 12 }
});
