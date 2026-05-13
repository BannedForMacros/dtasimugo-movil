import { StyleSheet } from 'react-native';
import { tema } from './tema';

export const compartidos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: tema.scrollFondo },
  contenedorPadding: { padding: 16 },
  tituloPantalla: { fontSize: 22, fontWeight: '800', color: tema.primario, marginBottom: 6 },
  subtituloPantalla: { fontSize: 13, color: tema.textoSecundario, marginBottom: 16 },
  tarjeta: {
    backgroundColor: tema.fondo,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: tema.borde
  },
  etiqueta: { fontSize: 12, color: tema.textoSecundario, fontWeight: '600', marginBottom: 4 },
  valor: { fontSize: 15, color: tema.textoPrincipal, fontWeight: '500' },
  filaEspaciada: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  textoLink: { color: tema.primario, fontWeight: '700' },
  textoError: { color: tema.error, fontSize: 13, marginTop: 6 }
});
