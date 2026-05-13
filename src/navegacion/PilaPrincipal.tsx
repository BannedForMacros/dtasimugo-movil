import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSesion } from '../contextos/SesionContext';
import { tema } from '../estilos/tema';
import { RootStackParamList } from '../tipos';

import IngresoScreen from '../pantallas/IngresoScreen';
import RegistroScreen from '../pantallas/RegistroScreen';
import SolicitudRecuperacionScreen from '../pantallas/SolicitudRecuperacionScreen';
import NuevaClaveScreen from '../pantallas/NuevaClaveScreen';

import PanelPrincipalScreen from '../pantallas/PanelPrincipalScreen';

import ListaExpedientesScreen from '../pantallas/ListaExpedientesScreen';
import FormularioExpedienteScreen from '../pantallas/FormularioExpedienteScreen';

import ListaOperacionesScreen from '../pantallas/ListaOperacionesScreen';
import RegistroOperacionScreen from '../pantallas/RegistroOperacionScreen';
import ConsultaOperacionScreen from '../pantallas/ConsultaOperacionScreen';
import AsientoOperacionScreen from '../pantallas/AsientoOperacionScreen';
import ModificarOperacionScreen from '../pantallas/ModificarOperacionScreen';

import CalculadoraTributariaScreen from '../pantallas/CalculadoraTributariaScreen';
import ResultadoCalculoScreen from '../pantallas/ResultadoCalculoScreen';
import AsientoCalculoScreen from '../pantallas/AsientoCalculoScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function PilaPrincipal() {
  const { cuenta, cargandoSesion } = useSesion();

  if (cargandoSesion) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: tema.fondo }}>
        <ActivityIndicator size="large" color={tema.primario} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {cuenta ? (
        <>
          <Stack.Screen name="PanelPrincipal" component={PanelPrincipalScreen} />
          <Stack.Screen name="ListaExpedientes" component={ListaExpedientesScreen} />
          <Stack.Screen name="FormularioExpediente" component={FormularioExpedienteScreen} />
          <Stack.Screen name="ListaOperaciones" component={ListaOperacionesScreen} />
          <Stack.Screen name="RegistroOperacion" component={RegistroOperacionScreen} />
          <Stack.Screen name="ConsultaOperacion" component={ConsultaOperacionScreen} />
          <Stack.Screen name="AsientoOperacion" component={AsientoOperacionScreen} />
          <Stack.Screen name="ModificarOperacion" component={ModificarOperacionScreen} />
          <Stack.Screen name="CalculadoraTributaria" component={CalculadoraTributariaScreen} />
          <Stack.Screen name="ResultadoCalculo" component={ResultadoCalculoScreen} />
          <Stack.Screen name="AsientoCalculo" component={AsientoCalculoScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Ingreso" component={IngresoScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
          <Stack.Screen name="SolicitudRecuperacion" component={SolicitudRecuperacionScreen} />
          <Stack.Screen name="NuevaClave" component={NuevaClaveScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
