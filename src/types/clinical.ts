export type TimeWindow =
  | 'under_2h'   // کمتر از ۲ ساعت
  | '2_to_24h'   // ۲ تا ۲۴ ساعت
  | '24_to_72h'  // ۲۴ تا ۷۲ ساعت
  | '3_to_7d'    // ۳ تا ۷ روز
  | 'over_7d';   // بیش از ۷ روز

export type SimpleExposureType =
  | 'percutaneous_high' // فرو رفتن سوزن خون‌آلود یا بریدگی عمیق
  | 'percutaneous_low'  // خراش سطحی یا سوزن بخیه بدون خون واضح
  | 'mucocutaneous'     // پاشش خون یا مایع به چشم، دهان یا پوست زخمی
  | 'no_risk';          // تماس با پوست سالم یا ترشحات بدون خون (ادرار، بزاق، عرق)

export type SourceKnowledge = 'known' | 'unknown';

export type SerologyStatus = 'positive' | 'negative' | 'unknown';

export type HcwHbvStatus =
  | 'vaccinated_responder'       // واکسن کامل + تیتر ≥ 10
  | 'vaccinated_unknown_titer'   // واکسن کامل + تیتر نامشخص
  | 'vaccinated_non_responder_1' // ۱ دوره کامل زده ولی تیتر < 10
  | 'vaccinated_non_responder_2' // ۲ دوره کامل (۶ دوز) زده و همچنان < 10
  | 'unvaccinated'               // واکسن نزده یا ناقص
  | 'hbv_carrier';               // خود فرد HBsAg مثبت است

export interface ClinicalAssessmentInput {
  timeWindow: TimeWindow;
  exposureType: SimpleExposureType;
  sourceKnowledge: SourceKnowledge;
  sourceHbsAg: SerologyStatus;
  sourceAntiHcv: SerologyStatus;
  sourceHiv: SerologyStatus;
  sourceHighRisk: boolean;
  hcwHbvStatus: HcwHbvStatus;
  isPregnantOrBreastfeeding: boolean;
  hasRenalDisease: boolean;
}

export type UrgencyLevel = 'urgent' | 'monitor' | 'safe';

export interface SimpleVirusAction {
  id: 'hbv' | 'hcv' | 'hiv';
  title: string;
  urgency: UrgencyLevel;
  badgeText: string;
  mainAction: string;
  steps: string[];
  tests: string[];
}

export interface FullClinicalProtocol {
  isZeroRisk: boolean;
  zeroRiskMessage?: string;
  overallUrgency: UrgencyLevel;
  firstAidSteps: string[];
  prohibitedSteps: string[];
  hbv: SimpleVirusAction;
  hcv: SimpleVirusAction;
  hiv: SimpleVirusAction;
}
