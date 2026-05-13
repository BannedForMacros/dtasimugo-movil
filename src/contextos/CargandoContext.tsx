import React, { createContext, useContext, useState, useCallback } from 'react';

interface CargandoCtx {
  cargando: boolean;
  mostrar: (mensaje?: string) => void;
  ocultar: () => void;
  mensaje: string;
}

const Contexto = createContext<CargandoCtx | null>(null);

export function CargandoProvider({ children }: { children: React.ReactNode }) {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('Cargando...');

  const mostrar = useCallback((m?: string) => {
    setMensaje(m || 'Cargando...');
    setCargando(true);
  }, []);
  const ocultar = useCallback(() => setCargando(false), []);

  return (
    <Contexto.Provider value={{ cargando, mensaje, mostrar, ocultar }}>
      {children}
    </Contexto.Provider>
  );
}

export function useCargando() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('CargandoContext sin provider');
  return ctx;
}
