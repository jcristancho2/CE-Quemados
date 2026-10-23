export interface QuemadosClinicalIndicator {
  title: string;
  result: string;
  coverage: string;
  detail: string;
}

export interface QuemadosIndicatorSegment {
  label: string;
  count: number;
  color: string;
}

export interface QuemadosIndicatorGroup {
  label: string;
  segments: QuemadosIndicatorSegment[];
}

export interface QuemadosIndicatorChart {
  title: string;
  note: string;
  groups: QuemadosIndicatorGroup[];
}

const YES = { label: 'Sí', color: 'var(--burn-chart-1)' };
const NO = { label: 'No', color: 'var(--burn-chart-2)' };
const NOT_APPLICABLE = { label: 'N/A', color: 'var(--burn-chart-3)' };
const MISSING = { label: 'Sin dato', color: '#d9dee6' };

/** Visualizaciones agregadas de los campos clínicos, con n=328 filas en la base principal. */
export const QUEMADOS_CLINICAL_CHARTS: QuemadosIndicatorChart[] = [
  {
    title: 'Control de diuresis',
    note: 'Control realizado durante los tres primeros días de hospitalización.',
    groups: [{ label: 'Primeros tres días', segments: [
      { ...YES, count: 291 }, { ...NO, count: 5 }, { ...MISSING, count: 32 },
    ] }],
  },
  {
    title: 'Manejo del dolor',
    note: 'Dos registros: escala al día 3 y mejoría reportada del dolor.',
    groups: [
      { label: 'Escala ≤2 al día 3', segments: [{ ...YES, count: 291 }, { ...NO, count: 5 }, { ...MISSING, count: 32 }] },
      { label: 'Mejora del dolor', segments: [{ ...YES, count: 175 }, { ...NO, count: 19 }, { ...NOT_APPLICABLE, count: 102 }, { ...MISSING, count: 32 }] },
    ],
  },
  {
    title: 'Infecciones',
    note: 'Infección asociada a la atención reportada en la base.',
    groups: [{ label: 'Infección asociada a la atención', segments: [
      { ...YES, count: 0 }, { ...NO, count: 296 }, { ...MISSING, count: 32 },
    ] }],
  },
  {
    title: 'Educación',
    note: 'Respuestas por tema; el segmento indica su proporción sobre las 328 filas.',
    groups: [
      { label: 'Generalidades', segments: [{ ...YES, count: 296 }, { ...MISSING, count: 32 }] },
      { label: 'Prevención de infecciones', segments: [{ ...YES, count: 296 }, { ...MISSING, count: 32 }] },
      { label: 'Autocuidado', segments: [{ ...YES, count: 296 }, { ...MISSING, count: 32 }] },
      { label: 'Dolor y prurito', segments: [{ ...YES, count: 296 }, { ...MISSING, count: 32 }] },
      { label: 'Cuidado en casa', segments: [{ ...YES, count: 295 }, { ...NOT_APPLICABLE, count: 1 }, { ...MISSING, count: 32 }] },
      { label: 'Procedimiento quirúrgico', segments: [{ ...YES, count: 57 }, { ...NO, count: 236 }, { ...NOT_APPLICABLE, count: 3 }, { ...MISSING, count: 32 }] },
    ],
  },
  {
    title: 'Intervenciones quirúrgicas',
    note: 'Tipo de procedimiento en la base principal. La hoja Injertados tiene 55 filas; no necesariamente son pacientes únicos.',
    groups: [{ label: 'Registro quirúrgico', segments: [
      { label: 'Injertos', count: 48, color: 'var(--burn-chart-2)' },
      { label: 'Lavado + desbridamiento', count: 2, color: 'var(--burn-chart-6)' },
      { label: 'Colgajo', count: 2, color: 'var(--burn-chart-4)' },
      { label: 'Injertos + colgajo', count: 2, color: 'var(--burn-chart-1)' },
      { ...NOT_APPLICABLE, count: 242 },
      { ...MISSING, count: 32 },
    ] }],
  },
  {
    title: 'Terapias integrales',
    note: 'Oportunidad de valoración y demoras registradas por disciplina.',
    groups: [{ label: 'Valoración integral', segments: [
      { label: 'Oportuna', count: 282, color: 'var(--burn-chart-1)' },
      { label: 'Demora nutrición', count: 10, color: 'var(--burn-chart-2)' },
      { label: 'Demora psicología', count: 2, color: 'var(--burn-chart-6)' },
      { label: 'Demora terapia física', count: 1, color: 'var(--burn-chart-4)' },
      { ...MISSING, count: 33 },
    ] }],
  },
  {
    title: 'Eficacia de la nutrición',
    note: 'El archivo no especifica una meta para comparar esta respuesta.',
    groups: [{ label: 'Eficacia registrada', segments: [
      { ...YES, count: 281 }, { ...NO, count: 14 }, { ...NOT_APPLICABLE, count: 1 }, { ...MISSING, count: 32 },
    ] }],
  },
];

/** Aggregate counts from rows 8–335 of the anonymized workbook's "Base de pacientes" sheet. */
export const QUEMADOS_CLINICAL_INDICATORS: QuemadosClinicalIndicator[] = [
  {
    title: 'Control de diuresis',
    result: '291 sí · 5 no',
    coverage: '296 de 328 filas',
    detail: 'Control durante los tres primeros días. 32 filas no tienen respuesta.',
  },
  {
    title: 'Manejo del dolor',
    result: '291 con escala ≤2 · día 3',
    coverage: '296 de 328 filas',
    detail: 'Mejora del dolor: 175 sí, 19 no y 102 N/A. 32 filas sin dato.',
  },
  {
    title: 'Infecciones',
    result: '0 sí · 296 no',
    coverage: '296 de 328 filas',
    detail: 'Infección asociada a la atención. 32 filas no tienen respuesta.',
  },
  {
    title: 'Educación',
    result: '4 temas: 296 sí · cada uno',
    coverage: '296 de 328 filas',
    detail: 'Temas generales, prevención, autocuidado y dolor/prurito. En cuidado en casa: 295 sí; en procedimiento quirúrgico: 57 sí, 236 no y 3 N/A.',
  },
  {
    title: 'Intervenciones quirúrgicas',
    result: '54 filas con procedimiento',
    coverage: '296 de 328 filas',
    detail: '48 injertos, 2 lavados con desbridamiento, 2 colgajos y 2 combinados. 242 N/A y 32 sin dato. La hoja Injertados tiene 55 filas; no necesariamente son pacientes únicos.',
  },
  {
    title: 'Terapias integrales',
    result: '282 oportunas · 13 demoras',
    coverage: '295 de 328 filas',
    detail: 'Demoras registradas: nutrición 10, psicología 2 y terapia física 1. 33 filas sin dato.',
  },
  {
    title: 'Eficacia de la nutrición',
    result: '281 sí · 14 no · 1 N/A',
    coverage: '296 de 328 filas',
    detail: '32 filas sin respuesta. El archivo no especifica una meta de eficacia.',
  },
];

export const QUEMADOS_CLINICAL_SUMMARIES = {
  diuresis: { yes: 291, no: 5, answered: 296, missing: 32 },
  painScale: { yes: 291, no: 5, answered: 296, missing: 32 },
  painImprovement: { yes: 175, no: 19, notApplicable: 102, missing: 32 },
  infection: { yes: 0, no: 296, answered: 296, missing: 32 },
  nutrition: { yes: 281, no: 14, notApplicable: 1, missing: 32 },
};
