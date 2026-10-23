import React from 'react';
import { QUEMADOS_CHARTS } from '../data/quemadosChartsData';

const TOTAL_REGISTROS = 328;
const CHART_COLORS = [
  'var(--burn-chart-1)', 'var(--burn-chart-2)', 'var(--burn-chart-3)',
  'var(--burn-chart-4)', 'var(--burn-chart-5)', 'var(--burn-chart-6)',
];

const CHART_SECTIONS = [
  {
    id: 'admissions-and-stay',
    title: 'Ingreso y hospitalización',
    description: 'Frecuencias de ingreso y duración registrada en la base.',
    chartTitles: ['Mes de ingreso', 'Días de estancia'],
  },
  {
    id: 'patient-profile',
    title: 'Perfil del paciente',
    description: 'Distribución demográfica de los registros disponibles.',
    chartTitles: ['Sexo', 'Edad: menores y mayores'],
  },
  {
    id: 'burn-profile',
    title: 'Características de las quemaduras',
    description: 'Extensión, gravedad, grado y mecanismo consignados.',
    chartTitles: ['Extensión de quemadura', 'Gravedad', 'Grado de quemadura', 'Mecanismo de quemadura'],
  },
  {
    id: 'social-security',
    title: 'Seguridad social',
    description: 'Agrupación de pagadores según los criterios definidos para el centro.',
    chartTitles: ['Seguridad social'],
  },
  {
    id: 'discharge',
    title: 'Disposición de egreso',
    description: 'Destino consignado al finalizar la atención.',
    chartTitles: ['Disposición de egreso'],
  },
];

const chartId = (title: string) => title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const createPieSlice = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
  const center = 100;
  const toPoint = (angle: number, pointRadius: number) => {
    const radians = (angle * Math.PI) / 180;
    return [center + pointRadius * Math.cos(radians), center + pointRadius * Math.sin(radians)];
  };
  const [startX, startY] = toPoint(startAngle, radius);
  const [endX, endY] = toPoint(endAngle, radius);
  const [innerEndX, innerEndY] = toPoint(endAngle, innerRadius);
  const [innerStartX, innerStartY] = toPoint(startAngle, innerRadius);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} L ${innerEndX} ${innerEndY} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY} Z`;
};

const PieChart: React.FC<{ title: string; points: typeof QUEMADOS_CHARTS[number]['points'] }> = ({ title, points }) => {
  const total = points.reduce((sum, point) => sum + point.count, 0);
  let angle = -90;
  const slices = points.map((point, index) => {
    const sweep = total > 0 ? (point.count / total) * 360 : 0;
    const slice = {
      ...point,
      color: CHART_COLORS[index % CHART_COLORS.length],
      startAngle: angle,
      endAngle: angle + sweep,
    };
    angle += sweep;
    return slice;
  });

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
      <svg viewBox="0 0 200 200" className="h-32 w-32 shrink-0" role="img" aria-label={`Gráfico de dona: ${title}`}>
        {slices.filter((slice) => slice.count > 0).map((slice, index) => (
          <path
            key={slice.label}
            d={createPieSlice(slice.startAngle, slice.endAngle, 78, 49)}
            fill={slice.color}
            stroke="white"
            strokeWidth="1.5"
          >
            <title>{`${slice.label}: ${slice.count} (${((slice.count / total) * 100).toFixed(1)}%)`}</title>
          </path>
        ))}
        <text x="100" y="96" textAnchor="middle" fontSize="20" fontWeight="800" fill="#172033">{total.toLocaleString('es-CO')}</text>
        <text x="100" y="113" textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="0.8" fill="#71809a">REGISTROS</text>
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-start justify-between gap-2 text-[10px]">
            <span className="flex min-w-0 items-start gap-1.5 text-slate-600">
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="leading-relaxed">{slice.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-600">
              <strong className="text-slate-900">{slice.count}</strong>
              <span className="ml-1 text-slate-400">{((slice.count / total) * 100).toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LineChart: React.FC<{ title: string; points: typeof QUEMADOS_CHARTS[number]['points'] }> = ({ title, points }) => {
  const width = 760;
  const angledLabels = points.length > 8;
  const height = angledLabels ? 340 : 300;
  const left = 48;
  const right = 24;
  const top = 20;
  const bottom = angledLabels ? 112 : 68;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxValue = Math.max(100, Math.ceil(Math.max(...points.map((point) => point.count)) / 25) * 25);
  const coordinates = points.map((point, index) => ({
    ...point,
    x: left + (points.length === 1 ? plotWidth / 2 : (index * plotWidth) / (points.length - 1)),
    y: top + plotHeight - (point.count / maxValue) * plotHeight,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
  const ticks = Array.from({ length: 5 }, (_, index) => Math.round((maxValue * index) / 4));

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`Gráfica lineal: ${title}`}>
        <title>{`Gráfica lineal de ${title}`}</title>
        <desc>Conteo de registros por categoría, con acentos rosa, azul marino y azul grisáceo.</desc>
        {ticks.map((tick) => {
          const y = top + plotHeight - (tick / maxValue) * plotHeight;
          return (
            <g key={tick}>
              <line x1={left} x2={width - right} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
              <text x={left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b">{tick}</text>
            </g>
          );
        })}
        <polyline
          fill="none"
          stroke="var(--burn-chart-2)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={coordinates.map(({ x, y }) => `${x},${y}`).join(' ')}
        />
        {coordinates.map((point, index) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="6" fill={point.color} stroke="white" strokeWidth="2">
              <title>{`${point.label}: ${point.count} (${((point.count / TOTAL_REGISTROS) * 100).toFixed(1)}%)`}</title>
            </circle>
            <text x={point.x} y={point.y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{point.count}</text>
            <text
              x={point.x}
              y={top + plotHeight + (angledLabels ? 6 : 22)}
              textAnchor={angledLabels ? (index === 0 ? 'start' : 'end') : 'middle'}
              transform={angledLabels ? `rotate(-40 ${point.x} ${top + plotHeight + 6})` : undefined}
              fontSize={angledLabels ? '10' : '11'}
              fill="#475569"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
        {coordinates.map((point) => (
          <li key={point.label} className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: point.color }} />
            <span className="truncate">{point.label}</span>
            <strong className="ml-auto tabular-nums text-slate-900">{point.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const QuemadosCharts: React.FC = () => {
  const chartsByTitle = new Map(QUEMADOS_CHARTS.map((chart) => [chart.title, chart]));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a75b69]">Desempeño clínico</p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Indicadores agregados</h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Conteos de la hoja principal · n = {TOTAL_REGISTROS}. “Sin dato” se conserva para mostrar la cobertura del archivo.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-[#ead5d9] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#87505b]">
          Histórico · fuente local
        </span>
      </div>

      {CHART_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-6 space-y-2.5">
          <div className="border-l-[3px] border-[#cf8590] pl-3">
            <h3 className="text-sm font-bold text-[#20364e]">{section.title}</h3>
            <p className="mt-0.5 text-[10px] text-slate-500">{section.description}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {section.chartTitles.map((title) => {
              const chart = chartsByTitle.get(title);
              if (!chart) return null;
              const maxCount = Math.max(...chart.points.map((point) => point.count), 1);
              const chartSpan = chart.type === 'line'
                ? section.id === 'social-security' ? 'md:col-span-2 xl:col-span-4' : 'md:col-span-2'
                : section.id === 'patient-profile' || section.id === 'discharge' ? 'xl:col-span-2' : '';

              return (
                <article
                  key={chart.title}
                  id={`chart-${chartId(chart.title)}`}
                  className={`burn-chart-card rounded-xl border border-[#e5e8ee] bg-white p-3.5 shadow-[0_3px_14px_rgba(32,54,78,0.045)] ${chartSpan}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-[11px] font-bold text-[#20364e]">{chart.title}</h4>
                    <span className="shrink-0 rounded-md bg-[#f5f6f8] px-2 py-1 text-[9px] font-medium tabular-nums text-slate-500">
                      n = {TOTAL_REGISTROS}
                    </span>
                  </div>
                  <p className="mt-1 min-h-7 text-[10px] leading-relaxed text-slate-500">{chart.note}</p>

                  <div className="mt-2">
                    {chart.type === 'pie' ? (
                      <PieChart title={chart.title} points={chart.points} />
                    ) : chart.type === 'line' ? (
                      <LineChart title={chart.title} points={chart.points} />
                    ) : (
                      <div className="space-y-2.5" role="list" aria-label={`Gráfica de barras: ${chart.title}`}>
                        {chart.points.map((point, index) => {
                          const percent = (point.count / TOTAL_REGISTROS) * 100;
                          const width = (point.count / maxCount) * 100;

                          return (
                            <div key={point.label} role="listitem" className="space-y-1">
                              <div className="flex items-baseline justify-between gap-3 text-[11px]">
                                <span className="min-w-0 truncate text-slate-700" title={point.label}>{point.label}</span>
                                <span className="shrink-0 tabular-nums text-slate-600">
                                  <strong className="text-slate-900">{point.count}</strong>
                                  <span className="ml-1 text-slate-400">{percent.toFixed(1)}%</span>
                                </span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{ width: `${width}%`, backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
