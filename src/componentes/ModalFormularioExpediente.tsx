import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import ModalApp from './ui/ModalApp';
import InputApp from './InputApp';
import BotonPrimario from './ui/BotonPrimario';
import { enviarJson, actualizarJson } from '../services/cliente-http';
import { Expediente } from '../tipos';

interface Props {
  visible: boolean;
  onCerrar: () => void;
  expediente?: Expediente;
  onGuardado: (exp: Expediente) => void;
}

export default function ModalFormularioExpediente({ visible, onCerrar, expediente, onGuardado }: Props) {
  const [titulo, setTitulo] = useState('');
  const [observ, setObserv] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitulo(expediente?.titulo_expediente || '');
      setObserv(expediente?.observaciones || '');
    }
  }, [visible, expediente]);

  const guardar = async () => {
    if (titulo.trim().length < 2) {
      Alert.alert('Validacion', 'El titulo debe tener al menos 2 caracteres.');
      return;
    }
    setGuardando(true);
    try {
      const cuerpo = {
        titulo_expediente: titulo.trim(),
        observaciones: observ.trim() || null
      };
      let resp: { expediente: Expediente };
      if (expediente) {
        resp = await actualizarJson(`/api/expedientes/${expediente.id}`, cuerpo);
      } else {
        resp = await enviarJson('/api/expedientes', cuerpo);
      }
      onGuardado(resp.expediente);
      onCerrar();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ModalApp
      visible={visible}
      titulo={expediente ? 'Editar expediente' : 'Nuevo expediente'}
      subtitulo="Contenedor de operaciones de internacion"
      onCerrar={onCerrar}
    >
      <InputApp
        etiqueta="Titulo"
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ej. Importacion electronicos 2026"
        maxLength={180}
      />
      <InputApp
        etiqueta="Observaciones (opcional)"
        value={observ}
        onChangeText={setObserv}
        placeholder="Notas internas"
        multiline
        numberOfLines={4}
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />
      <BotonPrimario
        texto={expediente ? 'Guardar cambios' : 'Crear expediente'}
        onPress={guardar}
        cargando={guardando}
        icono="save-outline"
      />
    </ModalApp>
  );
}
