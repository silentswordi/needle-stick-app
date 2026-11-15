import React from 'react';
import {
  ClinicalAssessmentInput,
  HcwHbvStatus,
  SerologyStatus,
  SimpleExposureType,
  TimeWindow,
} from '../types/clinical';
import { ArrowLeft } from 'lucide-react';

interface AssessmentFormProps {
  input: ClinicalAssessmentInput;
  onChange: (updated: ClinicalAssessmentInput) => void;
  onSubmit: () => void;
}

const TIME_OPTIONS: { value: TimeWindow; label: string }[] = [
  { value: 'under_2h', label: 'کمتر از ۲ ساعت' },
  { value: '2_to_24h', label: '۲ تا ۲۴ ساعت' },
  { value: '24_to_72h', label: '۲۴ تا ۷۲ ساعت' },
  { value: '3_to_7d', label: '۳ تا ۷ روز' },
  { value: 'over_7d', label: 'بیش از ۷ روز' },
];

const EXPOSURE_OPTIONS: { value: SimpleExposureType; label: string; hint: string }[] = [
  {
    value: 'percutaneous_high',
    label: 'فرو رفتن سوزن خون‌آلود یا بریدگی عمیق',
    hint: 'سوزن توخالی رگ، آنژیوکت یا زخم با خونریزی واضح',
  },
  {
    value: 'percutaneous_low',
    label: 'خراش سطحی یا سوزن بخیه بدون خون واضح',
    hint: 'آسیب سطحی با خون کم یا بدون خون مشخص',
  },
  {
    value: 'mucocutaneous',
    label: 'پاشش خون یا مایع به چشم، دهان یا پوست زخمی',
    hint: 'تماس با مخاط یا پوست دارای زخم/اگزما',
  },
  {
    value: 'no_risk',
    label: 'پوست کاملاً سالم یا ترشحات بدون خون (ادرار، بزاق، عرق)',
    hint: 'بدون زخم باز و بدون خون واضح',
  },
];

const HBV_OPTIONS: { value: HcwHbvStatus; label: string }[] = [
  { value: 'vaccinated_responder', label: 'واکسن کامل (۳ نوبت) + تیتر آنتی‌بادی ≥ ۱۰ (ایمن هستم)' },
  { value: 'vaccinated_unknown_titer', label: 'واکسن کامل (۳ نوبت) زده‌ام ولی تیتر آزمایش نکرده‌ام' },
  { value: 'vaccinated_non_responder_1', label: '۱ دوره کامل (۳ نوبت) زده‌ام ولی تیتر زیر ۱۰ بوده' },
  { value: 'vaccinated_non_responder_2', label: '۲ دوره کامل (۶ نوبت) زده‌ام و همچنان تیتر زیر ۱۰ است' },
  { value: 'unvaccinated', label: 'واکسن نزده‌ام یا دوره واکسن ناقص بوده' },
  { value: 'hbv_carrier', label: 'خودم HBsAg مثبت (ناقل) هستم' },
];

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  input,
  onChange,
  onSubmit,
}) => {
  const update = <K extends keyof ClinicalAssessmentInput>(
    key: K,
    val: ClinicalAssessmentInput[K]
  ) => {
    onChange({ ...input, [key]: val });
  };

  const renderSerologyRow = (
    label: string,
    value: SerologyStatus,
    onSelect: (val: SerologyStatus) => void
  ) => {
    const items: { val: SerologyStatus; text: string }[] = [
      { val: 'positive', text: 'مثبت' },
      { val: 'negative', text: 'منفی' },
      { val: 'unknown', text: 'نامشخص' },
    ];
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
        <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 sm:w-72">
          {items.map((item) => {
            const active = value === item.val;
            const style =
              item.val === 'positive'
                ? 'bg-rose-700 text-white'
                : item.val === 'negative'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs';
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => onSelect(item.val)}
                className={`rounded-md py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? style
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const isNoRisk = input.exposureType === 'no_risk';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800 transition-colors">
      {/* 1. Time */}
      <section className="p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          ۱. چقدر از حادثه گذشته است؟
        </h2>
        <div className="flex flex-wrap gap-2">
          {TIME_OPTIONS.map((opt) => {
            const active = input.timeWindow === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('timeWindow', opt.value)}
                className={`rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  active
                    ? 'border-sky-700 dark:border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Exposure Type */}
      <section className="p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          ۲. چه نوع تماسی رخ داده است؟
        </h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {EXPOSURE_OPTIONS.map((opt) => {
            const active = input.exposureType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('exposureType', opt.value)}
                className={`rounded-lg border p-3.5 text-right transition-colors ${
                  active
                    ? 'border-sky-700 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 ring-1 ring-sky-700 dark:ring-sky-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {opt.label}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{opt.hint}</div>
              </button>
            );
          })}
        </div>
      </section>

      {!isNoRisk && (
        <>
          {/* 3. Source Patient */}
          <section className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              ۳. وضعیت بیمار منبع
            </h2>

            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 max-w-md">
              <button
                type="button"
                onClick={() => update('sourceKnowledge', 'known')}
                className={`rounded-md py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  input.sourceKnowledge === 'known'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                بیمار مشخص است
              </button>
              <button
                type="button"
                onClick={() => update('sourceKnowledge', 'unknown')}
                className={`rounded-md py-2 text-xs sm:text-sm font-semibold transition-colors ${
                  input.sourceKnowledge === 'unknown'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                ناشناس / آزمایش ممکن نیست
              </button>
            </div>

            {input.sourceKnowledge === 'known' && (
              <div className="space-y-3 pt-2">
                {renderSerologyRow('هپاتیت B منبع (HBsAg)', input.sourceHbsAg, (v) =>
                  update('sourceHbsAg', v)
                )}
                {renderSerologyRow('هپاتیت C منبع (Anti-HCV)', input.sourceAntiHcv, (v) =>
                  update('sourceAntiHcv', v)
                )}
                {renderSerologyRow('HIV / ایدز منبع', input.sourceHiv, (v) =>
                  update('sourceHiv', v)
                )}
              </div>
            )}

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  آیا بیمار منبع یا بخش جزو موارد پرخطر (High-Risk) است؟
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  شامل سابقه اعتیاد تزریقی، همودیالیز، بخش عفونی، زندان، رفتار جنسی پرخطر یا سوزن مشکوک پرخطر (در وضعیت نامشخص تاثیر مستقیم در تجویز دارو دارد)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 max-w-md">
                <button
                  type="button"
                  onClick={() => update('sourceHighRisk', false)}
                  className={`rounded-md py-2 text-xs sm:text-sm font-semibold transition-colors ${
                    !input.sourceHighRisk
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  خیر، ریسک معمولی
                </button>
                <button
                  type="button"
                  onClick={() => update('sourceHighRisk', true)}
                  className={`rounded-md py-2 text-xs sm:text-sm font-semibold transition-colors ${
                    input.sourceHighRisk
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  بله، پرخطر (High-Risk)
                </button>
              </div>
            </div>
          </section>

          {/* 4. HCW HBV & Medical Conditions */}
          <section className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              ۴. وضعیت واکسن هپاتیت B و شرایط شما
            </h2>

            <div className="grid gap-2">
              {HBV_OPTIONS.map((opt) => {
                const active = input.hcwHbvStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('hcwHbvStatus', opt.value)}
                    className={`rounded-lg border px-4 py-2.5 text-right text-sm transition-colors ${
                      active
                        ? 'border-sky-700 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 font-semibold text-sky-950 dark:text-sky-100 ring-1 ring-sky-700 dark:ring-sky-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-5 pt-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={input.isPregnantOrBreastfeeding}
                  onChange={(e) => update('isPregnantOrBreastfeeding', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-sky-800 focus:ring-sky-700"
                />
                <span>باردار یا شیرده هستم</span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={input.hasRenalDisease}
                  onChange={(e) => update('hasRenalDisease', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-sky-800 focus:ring-sky-700"
                />
                <span>بیماری کلیوی دارم</span>
              </label>
            </div>
          </section>
        </>
      )}

      {/* Submit */}
      <div className="bg-slate-50/70 dark:bg-slate-900/80 p-6 flex justify-end rounded-b-xl">
        <button
          type="button"
          onClick={onSubmit}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-sky-800 dark:bg-sky-700 px-6 py-3 text-sm font-bold text-white hover:bg-sky-900 dark:hover:bg-sky-600 transition-colors"
        >
          <span>نمایش دستورالعمل وزارت بهداشت</span>
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
