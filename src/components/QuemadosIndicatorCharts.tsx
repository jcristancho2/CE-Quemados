import React from 'react';
import { QUEMADOS_CLINICAL_CHARTS } from '../data/quemadosIndicatorsData';

const TOTAL_REGISTROS = 328;
const cardClass = 'rounded-xl border border-[#e5e8ee] bg-white shadow-[0_3px_14px_rgba(32,54,78,0.045)]';

const formatCount = (count: number) => count.toLocaleString('es-CO');

export const QuemadosIndicatorCharts: React.FC = () => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
    {QUEMADOS_CLINICAL_CHARTS.map((chart) => {
      const legend = Array.from(new Map(
        chart.groups.flatMap((group) => group.segments).map((segment) => [segment.label, segment.color]),
      ));

      return (
        <article key={chart.title} className={`${cardClass} flex flex-col self-start p-4`}>
          <div className="mb-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-900">{chart.title}</h3>
              <span className="shrink-0 text-[9px] font-medium uppercase tracking-wide text-slate-400">n = {TOTAL_REGISTROS}</span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{chart.note}</p>
          </div>

          <div className={chart.title === 'Educación' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'space-y-3'}>
            {chart.groups.map((group) => {
              const summary = group.segments.map(({ label, count }) => `${label} ${formatCount(count)}`).join(' · ');
              return (
                <div key={group.label}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <span className="text-[10px] font-semibold text-slate-700">{group.label}</span>
                    <span className="text-[9px] tabular-nums text-slate-500">{summary}</span>
                  </div>
                  <div
                    role="img"
                    aria-label={`${group.label}: ${summary}, sobre ${TOTAL_REGISTROS} filas`}
                    className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200"
                  >
                    {group.segments.map((segment) => (
                      <span
                        key={segment.label}
                        title={`${segment.label}: ${formatCount(segment.count)} (${((segment.count / TOTAL_REGISTROS) * 100).toFixed(1)}%)`}
                        aria-hidden="true"
                        className="h-full transition-[width]"
                        style={{ width: `${(segment.count / TOTAL_REGISTROS) * 100}%`, backgroundColor: segment.color }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-3">
            {legend.map(([label, color]) => (
              <li key={label} className="flex items-center gap-1 text-[9px] text-slate-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{label}
              </li>
            ))}
          </ul>
        </article>
      );
    })}
  </div>
);
