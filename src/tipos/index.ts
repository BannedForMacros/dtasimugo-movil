export interface Cuenta {
  id: string;
  correo: string;
  alias: string | null;
  nombres_completos: string;
  cuenta_activa: boolean;
  creada_en: string;
}

export interface Expediente {
  id: string;
  cuenta_id: string;
  titulo_expediente: string;
  observaciones: string | null;
  estado_expediente: 'activo' | 'archivado' | 'eliminado';
  creado_en: string;
  modificado_en: string;
  operaciones_count?: number;
}

export interface Operacion {
  id: string;
  expediente_id: string;
  cuenta_id: string;
  modalidad_compra_nacional: boolean;
  categoria_mercaderia_id: number;
  codigo_partida: string;
  glosa_producto: string | null;
  divisa: string;
  monto_fob_usd: number;
  monto_flete_usd: number;
  monto_seguro_usd: number;
  aplicar_igv: boolean;
  aplicar_isc: boolean;
  aplicar_percepcion: boolean;
  tasa_advalorem_manual: number | null;
  tasa_isc_manual: number | null;
  tasa_percepcion_manual: number | null;
  cargo_antidumping: number;
  cargo_compensatorio: number;
  cargo_sda: number;
  base_cif_calculada: number;
  valor_advalorem: number;
  valor_isc: number;
  valor_igv: number;
  valor_ipm: number;
  valor_percepcion: number;
  total_obligacion_aduanera: number;
  libro_diario_json: any;
  fecha_internacion: string;
  fecha_tipo_cambio: string | null;
  vigente: boolean;
  registrada_en: string;
  glosa_partida?: string;
  denominacion_categoria?: string;
  cuenta_pcge?: string;
}

export interface PartidaArancelaria {
  codigo_partida: string;
  glosa_oficial: string;
  vigente: boolean;
  tasa_advalorem: number;
}

export interface CategoriaMercaderia {
  id: number;
  denominacion: string;
  cuenta_pcge: string;
  descripcion_extendida: string | null;
}

export interface TipoCambioDia {
  divisa: string;
  precio_compra: number;
  precio_venta: number;
  fecha: string;
}

export interface LineaDesglose {
  concepto_tributario: string;
  base_imponible: number;
  tasa_aplicada: number | null;
  valor_calculado: number;
}

export interface LineaAsiento {
  cuenta: string;
  nombre_cuenta: string;
  debe: number;
  haber: number;
}

export interface AsientoContable {
  glosa: string;
  moneda: string;
  tipo_cambio: number;
  detalles: LineaAsiento[];
  total_debe: number;
  total_haber: number;
  diferencia: number;
}

export interface ResultadoCalculo {
  modalidad_compra_nacional: boolean;
  codigo_partida: string | null;
  base_cif_calculada: number;
  tasa_advalorem_aplicada: number;
  valor_advalorem: number;
  valor_isc: number;
  valor_igv: number;
  valor_ipm: number;
  valor_percepcion: number;
  cargo_antidumping: number;
  cargo_compensatorio: number;
  cargo_sda: number;
  total_obligacion_aduanera: number;
  desglose: LineaDesglose[];
}

export type Divisa = 'USD' | 'PEN';

export type RootStackParamList = {
  Ingreso: undefined;
  Registro: undefined;
  SolicitudRecuperacion: undefined;
  NuevaClave: { token?: string } | undefined;
  PanelPrincipal: undefined;
  ListaExpedientes: undefined;
  FormularioExpediente: { expediente?: Expediente } | undefined;
  ListaOperaciones: { expediente: Expediente };
  RegistroOperacion: { expediente: Expediente };
  ConsultaOperacion: { operacionId: string };
  AsientoOperacion: { operacionId: string };
  ModificarOperacion: { operacion: Operacion };
  CalculadoraTributaria: undefined;
  ResultadoCalculo: { resultado: ResultadoCalculo };
  AsientoCalculo: { resultado: ResultadoCalculo };
};
