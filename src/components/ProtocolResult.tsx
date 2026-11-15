import React from 'react';
import {
  FullClinicalProtocol,
  SimpleVirusAction,
  UrgencyLevel,
} from '../types/clinical';
import { AlertOctagon, CheckCircle2, Clock, Edit3 } from 'lucide-react';

interface ProtocolResultProps {
  protocol: FullClinicalProtocol;
  onEdit: () => void;
}

const URGENCY_THEME: Record<
  UrgencyLevel,
  { headerBg: string; text: string; Icon: React.FC<{ className?: string }> }
> = {
  urgent: {
    headerBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/70',
    text: 'text-rose-800 dark:text-rose-300',
    Icon: AlertOctagon,
  },
  monitor: {
    headerBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
    text: 'text-amber-800 dark:text-amber-300',
    Icon: Clock,
  },
  safe: {
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60',
    text: 'text-emerald-800 dark:text-emerald-300',
    Icon: CheckCircle2,
  },
};

export const ProtocolResult: React.FC<ProtocolResultProps> = ({
  protocol,
  onEdit,
}) => {
  const renderCard = (virus: SimpleVirusAction) => {
    const theme = URGENCY_THEME[virus.urgency];
    const StatusIcon = theme.Icon;

    return (
      <section
        key={virus.id}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
      >
        <div
          className={`border-b px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 ${theme.headerBg}`}
        >
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {virus.title}
          </h2>
          <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold ${theme.text}`}>
            <StatusIcon className="h-4 w-4 shrink-0" />
            <span>{virus.badgeText}</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
            {virus.mainAction}
          </p>

          {virus.steps.length > 0 && (
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                دارو و اقدام:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {virus.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-700 dark:bg-sky-400 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {virus.tests.length > 0 && (
            <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                آزمایش‌های پیگیری:
              </p>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {virus.tests.map((test, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar (Print button removed) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          دستورالعمل بالینی بر اساس پروتکل وزارت بهداشت
        </h1>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>تغییر گزینه‌ها</span>
        </button>
      </div>

      {/* Section 1 of Protocol: Immediate First Aid & Prohibited Actions */}
      {protocol.isZeroRisk ? (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-2">
          <h2 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            اقدامات فوری
          </h2>
          <p className="text-sm leading-relaxed text-emerald-900 dark:text-emerald-300 font-medium">
            {protocol.zeroRiskMessage}
          </p>
        </div>
      ) : (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 px-5 py-3.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              اقدامات فوری لحظه اول
            </h2>
          </div>

          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold text-sky-800 dark:text-sky-400">
                کارهایی که باید همین الان انجام دهید:
              </p>
              <ul className="space-y-2 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {protocol.firstAidSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-sky-800 dark:text-sky-400 tabular-nums shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {protocol.prohibitedSteps.length > 0 && (
              <div className="space-y-2 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 p-4">
                <p className="text-xs font-bold text-rose-900 dark:text-rose-300">
                  کارهای ممنوع:
                </p>
                <ul className="space-y-1.5 text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
                  {protocol.prohibitedSteps.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-rose-700 dark:text-rose-400 shrink-0">×</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Disease Protocols */}
      <div className="space-y-4">
        {renderCard(protocol.hiv)}
        {renderCard(protocol.hbv)}
        {renderCard(protocol.hcv)}
      </div>
    </div>
  );
};
