export default {
  expo: {
    name: 'DTASimuGo',
    slug: 'dtasimugo-movil',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'dtasimugo',
    userInterfaceStyle: 'light',
    primaryColor: '#1d3a8a',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#1d3a8a'
    },
    ios: {
      bundleIdentifier: 'pe.dtasimugo.app',
      supportsTablet: true
    },
    android: {
      package: 'pe.dtasimugo.app',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1d3a8a'
      },
      softwareKeyboardLayoutMode: 'pan'
    },
    plugins: [
      'expo-secure-store',
      'expo-font'
    ],
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4001'
    }
  }
};
