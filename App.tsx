import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { SesionProvider } from './src/contextos/SesionContext';
import { CargandoProvider } from './src/contextos/CargandoContext';
import PilaPrincipal from './src/navegacion/PilaPrincipal';
import { tema } from './src/estilos/tema';

const linking = {
  prefixes: [Linking.createURL('/'), 'dtasimugo://'],
  config: {
    screens: {
      NuevaClave: 'reset-clave'
    }
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <CargandoProvider>
        <SesionProvider>
          <NavigationContainer linking={linking} theme={{
            dark: false,
            colors: {
              primary: tema.primario,
              background: tema.fondo,
              card: tema.superficie,
              text: tema.textoPrincipal,
              border: tema.borde,
              notification: tema.secundario
            },
            fonts: {
              regular: { fontFamily: 'System', fontWeight: '400' },
              medium: { fontFamily: 'System', fontWeight: '500' },
              bold: { fontFamily: 'System', fontWeight: '700' },
              heavy: { fontFamily: 'System', fontWeight: '900' }
            }
          }}>
            <StatusBar style="light" backgroundColor={tema.primario} />
            <PilaPrincipal />
          </NavigationContainer>
        </SesionProvider>
      </CargandoProvider>
    </SafeAreaProvider>
  );
}
