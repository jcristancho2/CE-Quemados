export interface QuemadosChartPoint {
  label: string;
  count: number;
}

export interface QuemadosChart {
  title: string;
  note: string;
  type: 'pie' | 'bar' | 'line';
  points: QuemadosChartPoint[];
}

/** Conteos agregados de la hoja "Base de pacientes"; nunca contiene filas individuales. */
export const QUEMADOS_CHARTS: QuemadosChart[] = [
  {
    title: 'Sexo',
    note: 'Distribución registrada en la base.',
    type: 'pie',
    points: [
      { label: 'Masculino', count: 211 },
      { label: 'Femenino', count: 103 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Seguridad social',
    note: 'EPS agrupa Sanitas + Salud Total; ARL agrupa las etiquetas con “ARL”; EPSS corresponde a Coosalud. Las demás categorías y faltantes se muestran aparte.',
    type: 'line',
    points: [
      { label: 'SOAT', count: 58 },
      { label: 'EPS', count: 83 },
      { label: 'ARL', count: 72 },
      { label: 'EPSS', count: 10 },
      { label: 'Otras entidades', count: 91 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Mes de ingreso',
    note: 'Frecuencia por mes calendario; combina los años presentes en la base y no representa una tendencia anual.',
    type: 'line',
    points: [
      { label: 'Enero', count: 31 },
      { label: 'Febrero', count: 26 },
      { label: 'Marzo', count: 39 },
      { label: 'Abril', count: 36 },
      { label: 'Mayo', count: 37 },
      { label: 'Junio', count: 34 },
      { label: 'Julio', count: 27 },
      { label: 'Agosto', count: 28 },
      { label: 'Septiembre', count: 31 },
      { label: 'Octubre', count: 17 },
      { label: 'Noviembre', count: 0 },
      { label: 'Diciembre', count: 8 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Días de estancia',
    note: 'Calculados desde las fechas de ingreso y egreso; 32 filas sin fecha de egreso quedan como “Sin dato”.',
    type: 'line',
    points: [
      { label: '1–7 días', count: 73 },
      { label: '8–14 días', count: 121 },
      { label: '15–30 días', count: 73 },
      { label: '31–60 días', count: 28 },
      { label: 'Más de 60 días', count: 1 },
      { label: 'Sin dato de egreso', count: 32 },
    ],
  },
  {
    title: 'Extensión de quemadura',
    note: 'Categorías de extensión SCT tal como aparecen en el archivo.',
    type: 'pie',
    points: [
      { label: 'Menos del 10% SCT', count: 240 },
      { label: '10–20% SCT', count: 58 },
      { label: '21–40% SCT', count: 12 },
      { label: 'Más del 41% SCT', count: 4 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Gravedad',
    note: 'Todos los registros con dato están clasificados como graves; no hay otras categorías para comparar.',
    type: 'pie',
    points: [
      { label: 'Grave', count: 314 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Grado de quemadura',
    note: 'Categorías de grado transcritas de la base.',
    type: 'pie',
    points: [
      { label: 'Grado II', count: 219 },
      { label: 'Grado II–III', count: 83 },
      { label: 'Grado III', count: 11 },
      { label: 'Grado I–II', count: 1 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Mecanismo de quemadura',
    note: 'Categorías de la hoja principal; la línea compara frecuencias y no representa una secuencia temporal.',
    type: 'line',
    points: [
      { label: 'Líquidos hirvientes', count: 125 },
      { label: 'Abrasión', count: 59 },
      { label: 'Fuego y llamas', count: 50 },
      { label: 'Agentes químicos', count: 32 },
      { label: 'Superficies calientes', count: 25 },
      { label: 'Electricidad', count: 16 },
      { label: 'Pólvora', count: 5 },
      { label: 'Otros mecanismos', count: 2 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Edad: menores y mayores',
    note: 'Usa la clasificación “Menor/Mayor” de la hoja, no la edad actual calculada con HOY().',
    type: 'pie',
    points: [
      { label: 'Menores de edad', count: 76 },
      { label: 'Mayores de edad', count: 238 },
      { label: 'Sin dato', count: 14 },
    ],
  },
  {
    title: 'Disposición de egreso',
    note: 'Distribución de la disposición consignada al egreso; los faltantes se muestran aparte.',
    type: 'pie',
    points: [
      { label: 'Alta a casa', count: 291 },
      { label: 'Salida voluntaria', count: 3 },
      { label: 'Remisión', count: 1 },
      { label: 'Muerte', count: 1 },
      { label: 'Sin dato', count: 32 },
    ],
  },
];
