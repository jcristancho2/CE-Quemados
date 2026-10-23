import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpenCheck,
  CalendarClock,
  ClipboardCheck,
  Database,
  FileWarning,
  Flame,
  HeartPulse,
  Home,
  Scale,
  ShieldCheck,
  Users,
  Droplets,
  HeartHandshake,
} from 'lucide-react';
import { CentroExcelencia } from '../types/clinical';
import { QUEMADOS_CHARTS } from '../data/quemadosChartsData';
import { QUEMADOS_CLINICAL_SUMMARIES } from '../data/quemadosIndicatorsData';
import { QuemadosCharts } from './QuemadosCharts';
import { QuemadosIndicatorCharts } from './QuemadosIndicatorCharts';

interface QuemadosOverviewProps {
  centro: CentroExcelencia;
  onBack: () => void;
}

const NAV_ITEMS = [
  { id: 'burn-summary', label: 'Resumen', icon: Activity },
  { id: 'admissions-and-stay', label: 'Ingreso y estancia', icon: CalendarClock },
  { id: 'patient-profile', label: 'Perfil del paciente', icon: Users },
  { id: 'burn-profile', label: 'Características de las quemaduras', icon: Flame },
  { id: 'social-security', label: 'Seguridad social', icon: ShieldCheck },
  { id: 'discharge', label: 'Disposición de egreso', icon: Home },
  { id: 'clinical-outcomes', label: 'Indicadores clínicos', icon: HeartPulse },
  { id: 'data-quality', label: 'Calidad de datos', icon: FileWarning },
  { id: 'care-model', label: 'Modelo de atención', icon: HeartHandshake },
];

const chartCount = (title: string, label: string) =>
  QUEMADOS_CHARTS.find((chart) => chart.title === title)?.points.find((point) => point.label === label)?.count ?? 0;

const percentage = (count: number, total: number) =>
  `${((count / (total || 1)) * 100).toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`;

const cardClass = 'rounded-xl border border-[#e5e8ee] bg-white shadow-[0_3px_14px_rgba(32,54,78,0.045)]';

const PALETTES = [
  { id: 'rose', label: 'Rosa vivo', colors: ['#e85d83', '#18324b', '#48a6dd'] },
  { id: 'ocean', label: 'Turquesa', colors: ['#00a8ad', '#143f56', '#47c7d4'] },
  { id: 'indigo', label: 'Índigo', colors: ['#696df0', '#292f68', '#72a0f5'] },
  { id: 'sage', label: 'Esmeralda', colors: ['#27b47c', '#17463d', '#7ed9ad'] },
] as const;

type PaletteId = typeof PALETTES[number]['id'];

export const QuemadosOverview: React.FC<QuemadosOverviewProps> = ({ centro, onBack }) => {
  const [activeSection, setActiveSection] = useState('burn-summary');
  const [palette, setPalette] = useState<PaletteId>(() => {
    try {
      const savedPalette = typeof window === 'undefined' ? null : window.localStorage.getItem('quemados-palette');
      return PALETTES.find(({ id }) => id === savedPalette)?.id ?? 'rose';
    } catch {
      return 'rose';
    }
  });
  const resumen = centro.resumenHistorico;
  if (!resumen) return null;

  const total = resumen.registrosCasos;
  const severeCount = chartCount('Gravedad', 'Grave');
  const smallBurnCount = chartCount('Extensión de quemadura', 'Menos del 10% SCT');
  const homeDischargeCount = chartCount('Disposición de egreso', 'Alta a casa');

  const chartMetrics = [
    { label: 'Clasificados como graves', value: severeCount, detail: percentage(severeCount, total), icon: HeartPulse },
    { label: 'Extensión menor al 10% SCT', value: smallBurnCount, detail: percentage(smallBurnCount, total), icon: Activity },
    { label: 'Alta a casa', value: homeDischargeCount, detail: percentage(homeDischargeCount, total), icon: ClipboardCheck },
  ];

  const careMetrics = [
    { label: 'Control de diuresis', value: percentage(QUEMADOS_CLINICAL_SUMMARIES.diuresis.yes, QUEMADOS_CLINICAL_SUMMARIES.diuresis.answered), detail: `${QUEMADOS_CLINICAL_SUMMARIES.diuresis.yes} sí · ${QUEMADOS_CLINICAL_SUMMARIES.diuresis.no} no · primeros 3 días`, icon: Droplets, color: 'text-[#526d88] bg-[#eaf0f5]' },
    { label: 'Manejo del dolor', value: percentage(QUEMADOS_CLINICAL_SUMMARIES.painScale.yes, QUEMADOS_CLINICAL_SUMMARIES.painScale.answered), detail: `Escala ≤2 al día 3 · ${QUEMADOS_CLINICAL_SUMMARIES.painScale.yes}/${QUEMADOS_CLINICAL_SUMMARIES.painScale.answered}`, icon: HeartPulse, color: 'text-[#9b5261] bg-[#f8e8ea]' },
    { label: 'Infección asociada', value: String(QUEMADOS_CLINICAL_SUMMARIES.infection.yes), detail: `${QUEMADOS_CLINICAL_SUMMARIES.infection.yes} sí · ${QUEMADOS_CLINICAL_SUMMARIES.infection.no} no · ${QUEMADOS_CLINICAL_SUMMARIES.infection.missing} sin dato`, icon: ShieldCheck, color: 'text-[#263d56] bg-[#edf1f5]' },
    { label: 'Educación general', value: '4/4', detail: '4 temas con 296 respuestas “Sí”', icon: BookOpenCheck, color: 'text-[#9b5261] bg-[#f8e8ea]' },
  ];

  const dataQuality = [
    {
      count: resumen.egresosSinFecha,
      label: 'Filas sin fecha de egreso',
      detail: `${percentage(resumen.egresosSinFecha, total)} del total; limita la validación de la duración de estancia.`,
    },
    {
      count: resumen.filasSinCodigoAtencion,
      label: 'Filas sin código de atención',
      detail: `${percentage(resumen.filasSinCodigoAtencion, total)} del total; revisar antes de cruzar episodios.`,
    },
    {
      count: resumen.filasAdicionalesConCodigoRepetido,
      label: 'Filas adicionales con código repetido',
      detail: 'Confirmar si corresponden a reingresos o duplicados.',
    },
  ];

  useEffect(() => {
    const updateActiveSection = () => {
      const passedSections = NAV_ITEMS
        .map(({ id }) => ({ id, element: document.getElementById(id) }))
        .filter(({ element }) => {
          if (!element) return false;
          const bounds = element.getBoundingClientRect();
          return bounds.top <= 220 && bounds.bottom > 0;
        });
      setActiveSection(passedSections[passedSections.length - 1]?.id ?? 'burn-summary');
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('quemados-palette', palette);
    } catch {
      // Keep the selected palette for this render even when browser storage is unavailable.
    }
  }, [palette]);

  const navLink = (id: string, label: string, compact = false) => {
    const NavIcon = NAV_ITEMS.find((item) => item.id === id)?.icon;
    return (
      <a
        key={id}
        href={`#${id}`}
        onClick={() => setActiveSection(id)}
        className={compact
          ? `shrink-0 rounded-full px-3 py-1.5 text-[10px] ${activeSection === id ? 'bg-[#c37c87] font-semibold text-white' : 'bg-white/10 text-slate-200'}`
          : `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[11px] transition-colors ${activeSection === id ? 'bg-[#c37c87] font-semibold text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
      >
        {!compact && NavIcon && <NavIcon className="h-4 w-4 shrink-0" />}
        <span>{label}</span>
      </a>
    );
  };

  return (
    <div className="burn-dashboard min-h-screen bg-[#f3f5f8] text-slate-900" data-palette={palette}>
      <header className="burn-hero sticky top-0 z-40 overflow-hidden border-b border-[#eadfe1] px-4 py-4 md:px-7 md:py-5">
        <div className="relative z-10 mx-auto flex max-w-[1480px] flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="min-w-0">
            <button type="button" onClick={onBack} className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8c5962] hover:text-[#623d45] lg:hidden">← Centros</button>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a56570]">FCV · Centro de Excelencia</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl xl:text-[2.15rem]">UNIDAD DE QUEMADOS</h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#31465c] sm:text-xs">Tablero de desempeño clínico</p>
            <p className="mt-1.5 hidden text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:block">Excelencia · Seguridad · Recuperación · Calidad de vida</p>
          </div>
          <div className="flex w-full items-stretch gap-2 sm:w-auto">
            <div className="hidden w-[205px] rounded-xl border border-[#eadfe1] bg-white/85 px-3 py-2.5 shadow-sm sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">Fuente del tablero</p>
              <p className="mt-1 truncate text-[11px] font-semibold text-slate-800" title={resumen.archivo}>{resumen.archivo}</p>
              <p className="mt-1 text-[9px] text-slate-500">Agregados locales · {total} filas</p>
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-[#eadfe1] bg-white/85 px-3 py-2 shadow-sm sm:w-[300px] sm:flex-none">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">Prueba otra paleta</p>
              <div className="grid grid-cols-2 gap-1.5">
                {PALETTES.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPalette(option.id)}
                    aria-pressed={palette === option.id}
                    aria-label={`Usar paleta ${option.label}`}
                    className={`flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1 text-left text-[9px] font-semibold transition-colors ${palette === option.id ? 'border-[#c37c87] bg-[#fff7f8] text-slate-800' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span className="flex shrink-0 -space-x-1" aria-hidden="true">
                      {option.colors.map((color) => <span key={color} className="h-3 w-3 rounded-full border border-white" style={{ backgroundColor: color }} />)}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex min-h-screen">
        <aside className="sticky top-[132px] hidden h-[calc(100vh-132px)] w-[220px] shrink-0 flex-col bg-[#172b40] px-3 py-5 text-white lg:flex">
          <button type="button" onClick={onBack} className="mb-6 flex items-center gap-2 self-start rounded-lg px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white">
            <span aria-hidden="true">←</span> Centros
          </button>
          <div className="mb-7 flex items-center gap-3 px-1">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d58a94] text-white shadow-sm"><Flame className="h-5 w-5" /></span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300">FCV</span>
              <span className="mt-0.5 block text-xs font-semibold leading-tight">Centro de Excelencia<br />de Quemados</span>
            </span>
          </div>
          <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Panel clínico</p>
          <nav aria-label="Secciones del tablero" className="space-y-1">
            {NAV_ITEMS.map(({ id, label }) => navLink(id, label))}
          </nav>
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-white"><Database className="h-3.5 w-3.5 text-[#c88a96]" />Fuente histórica local</div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-slate-300">Conteos agregados · sin conexión clínica</p>
            </div>
            <p className="mt-4 px-1 text-[9px] leading-relaxed text-slate-400">Fundación Cardiovascular de Colombia</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <nav aria-label="Navegación rápida" className="flex gap-2 overflow-x-auto bg-[#172b40] px-4 py-2.5 text-white lg:hidden">
            {NAV_ITEMS.map(({ id, label }) => navLink(id, label, true))}
          </nav>

          <main className="mx-auto max-w-[1480px] space-y-5 px-4 py-5 md:px-6 md:py-6 xl:px-8">
            <section id="burn-summary" className="scroll-mt-6 space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a75b69]">Panorama asistencial</p>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Resumen de la base</h2>
                </div>
                <span className="w-fit rounded-full border border-[#ead5d9] bg-white px-3 py-1 text-[10px] font-medium text-[#87505b]">Histórico · n = {total}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <article className="relative flex min-h-[154px] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br from-[#984c5a] via-[#bd737f] to-[#d99ba4] p-4 text-white shadow-[0_4px_14px_rgba(152,76,90,0.2)]">
                  <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[20px] border-white/10" aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-2">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-semibold text-white/90"><Users className="h-3.5 w-3.5" /> Registros de atención</p>
                      <p className="mt-2 text-4xl font-extrabold leading-none tabular-nums">{total.toLocaleString('es-CO')}</p>
                      <p className="mt-1.5 max-w-[185px] text-[10px] leading-snug text-white/85">filas en la base histórica del centro</p>
                    </div>
                    <Activity className="relative mt-1 h-5 w-5 text-white/90" />
                  </div>
                  <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-white/20 pt-2.5 text-[9px] text-white/85">
                    <span>{resumen.registrosInjertos} filas en hoja Injertados</span>
                    <span>Base local</span>
                  </div>
                </article>
                {chartMetrics.map(({ label, value, detail, icon: Icon }) => (
                  <article key={label} className={`${cardClass} flex min-h-[154px] flex-col justify-between p-3.5`}>
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8e8ea] text-[#9b5261]"><Icon className="h-4 w-4" /></span>
                      <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">Base histórica</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-none tabular-nums tracking-tight text-slate-900">{value.toLocaleString('es-CO')}</p>
                      <p className="mt-1.5 text-[10px] font-semibold leading-tight text-slate-800">{label}</p>
                      <p className="mt-1 text-[9px] text-slate-500">{detail} del total</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {careMetrics.map(({ label, value, detail, icon: Icon, color }) => (
                  <article key={label} className={`${cardClass} flex min-h-[110px] items-center gap-3 p-3.5`}>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${color}`}><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-slate-500">{label}</p>
                      <p className="mt-1 text-xl font-extrabold leading-none tabular-nums tracking-tight text-slate-900">{value}</p>
                      <p className="mt-1 text-[9px] leading-snug text-slate-500">{detail}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="flex items-start gap-2 text-[10px] leading-relaxed text-slate-500">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a75b69]" />Los registros son históricos y no describen el censo activo. Los indicadores clínicos usan la cobertura respondida en el Excel; las filas faltantes se señalan por indicador.
              </p>
            </section>

            <QuemadosCharts />

            <section id="clinical-outcomes" className="scroll-mt-6 space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a75b69]">Resultados asistenciales</p>
                  <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Indicadores clínicos del Excel</h2>
                </div>
                <p className="text-[10px] text-slate-500">328 filas en la base; cobertura distinta según cada campo.</p>
              </div>
              <QuemadosIndicatorCharts />
            </section>

            <section id="data-quality" className="scroll-mt-6 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a75b69]">Calidad y límites</p>
                <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Cobertura de la información</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <section className={`${cardClass} p-4`}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f8e8ea] text-[#9b5261]"><FileWarning className="h-4 w-4" /></span>
                    <div><h3 className="text-xs font-bold text-slate-900">Calidad de los registros</h3><p className="text-[10px] text-slate-500">Revisiones antes de interpretar episodios.</p></div>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {dataQuality.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                        <div><p className="text-[10px] font-semibold text-slate-800">{item.label}</p><p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{item.detail}</p></div>
                        <span className="shrink-0 rounded-lg bg-[#f8e8ea] px-2 py-1 text-sm font-bold tabular-nums text-[#8c4c58]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className={`${cardClass} p-4`}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eaf0f5] text-[#526d88]"><Scale className="h-4 w-4" /></span>
                    <div><h3 className="text-xs font-bold text-slate-900">Medidas no calculables con este archivo</h3><p className="text-[10px] text-slate-500">Variables que requieren registros adicionales.</p></div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg bg-slate-50 p-2.5"><p className="text-[10px] font-semibold text-slate-800">Pérdida de peso mayor al 7%</p><p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">No hay un par de mediciones de peso del día 5 y del egreso.</p></div>
                    <div className="rounded-lg bg-slate-50 p-2.5"><p className="text-[10px] font-semibold text-slate-800">Seguimiento a 1, 3, 6 y 12 meses</p><p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">La ficha describe los hitos, pero no hay fechas de contacto o consulta para calcularlos.</p></div>
                    <div className="rounded-lg bg-slate-50 p-2.5"><p className="text-[10px] font-semibold text-slate-800">Metas de referencia</p><p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">El Excel contiene resultados observados, pero no define metas para comparar tasas de cumplimiento.</p></div>
                  </div>
                </section>
              </div>
            </section>

            <section id="care-model" className="scroll-mt-6 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a75b69]">Ficha de empalme</p>
                <h2 className="mt-1 text-base font-bold tracking-tight text-slate-900">Operación descrita para el centro</h2>
                <p className="text-[10px] text-slate-500">Procesos reportados en la ficha; no son métricas de resultado.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <article className={`${cardClass} p-4`}><p className="text-[11px] font-bold text-slate-800">Ingreso y hospitalización</p><p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">Consentimiento, alerta en SAHI, educación, registro en historia y seguimiento educativo durante la estancia.</p></article>
                <article className={`${cardClass} p-4`}><p className="text-[11px] font-bold text-slate-800">Consulta externa</p><p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">Seguimiento ambulatorio, revisión de historia clínica y captura manual de variables en el Excel.</p></article>
                <article className={`${cardClass} p-4`}><p className="text-[11px] font-bold text-slate-800">Informes y mejora</p><p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">Informe mensual de desempeño, revisión trimestral y planes de mejora reportados en Almera.</p></article>
              </div>
              <p className="flex items-start gap-2 rounded-lg border border-[#dce6e9] bg-[#f2f7f8] p-3 text-[10px] leading-relaxed text-[#435f69]">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />La ficha reserva al responsable clínico la validación de resultados y decisiones. La frecuencia de seguimiento queda ambigua en la extracción del documento; confirmar en el original. El ahorro de 60 horas mensuales se reporta como estimación, no como resultado de un piloto.
              </p>
            </section>
          </main>

          <footer className="border-t border-[#e5e8ee] bg-white px-4 py-4 text-[10px] text-slate-500 md:px-6 xl:px-8">
            <div className="mx-auto flex max-w-[1480px] flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span><strong className="text-slate-700">Cerebro FCV</strong> · Plataforma de Centros de Excelencia en Salud</span>
              <span>{resumen.archivo} · Fundación Cardiovascular de Colombia</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
