import {
  ClinicalAssessmentInput,
  FullClinicalProtocol,
  SerologyStatus,
  SimpleVirusAction,
  UrgencyLevel,
} from '../types/clinical';

export function evaluateClinicalProtocol(input: ClinicalAssessmentInput): FullClinicalProtocol {
  const {
    timeWindow,
    exposureType,
    sourceKnowledge,
    sourceHbsAg,
    sourceAntiHcv,
    sourceHiv,
    sourceHighRisk,
    hcwHbvStatus,
    isPregnantOrBreastfeeding,
    hasRenalDisease,
  } = input;

  const hivWithin72h = timeWindow === 'under_2h' || timeWindow === '2_to_24h' || timeWindow === '24_to_72h';
  const hbvWithin7d = hivWithin72h || timeWindow === '3_to_7d';

  const firstAidSteps =
    exposureType === 'mucocutaneous'
      ? [
          'چشم، دهان یا پوست زخمی را بلافاصله ۱۰ تا ۱۵ دقیقه با سرم نرمال سالین استریل یا آب فراوان شستشو دهید (در صورت وجود لنز تماسی ابتدا خارج کنید و چشم را نمالید).',
          'بلافاصله حادثه را به سوپروایزر شیفت و واحد کنترل عفونت بیمارستان اطلاع دهید تا نمونه بیمار منبع بررسی شود.',
          'برای شروع پروفیلاکسی HIV حداکثر ۷۲ ساعت (بهترین زمان ۲ ساعت اول) و برای HBIG حداکثر ۷ روز فرصت دارید.',
        ]
      : [
          'محل آسیب را فوراً زیر آب ولرم و با صابون معمولی بشویید و پس از خشک کردن با گاز تمیز پانسمان ساده کنید.',
          'بلافاصله حادثه را به سوپروایزر شیفت و واحد کنترل عفونت بیمارستان اطلاع دهید تا نمونه بیمار منبع بررسی شود.',
          'برای شروع پروفیلاکسی HIV حداکثر ۷۲ ساعت (بهترین زمان ۲ ساعت اول) و برای HBIG حداکثر ۷ روز فرصت دارید.',
        ];

  const prohibitedSteps = [
    'زخم را فشار ندهید، ندوشید و نمکید (التهاب موضعی باعث ورود بیشتر ویروس می‌شود).',
    'داخل زخم باز الکل، بتادین خالص یا وایتکس نریزید.',
    'در موارد پرخطر، شروع داروی HIV را به بهانه آماده شدن جواب بیمار به تاخیر نیندازید.',
  ];

  if (exposureType === 'no_risk') {
    return {
      isZeroRisk: true,
      zeroRiskMessage:
        'تماس با پوست کاملاً سالم یا ترشحات فاقد خون واضح (ادرار، بزاق، عرق و مدفوع بدون خون) ریسک انتقال هپاتیت B، هپاتیت C و HIV ندارد و نیازی به دارو یا آزمایش نیست.',
      overallUrgency: 'safe',
      firstAidSteps: ['محل تماس را با آب و صابون بشویید.'],
      prohibitedSteps: [],
      hbv: {
        id: 'hbv',
        title: 'هپاتیت B',
        urgency: 'safe',
        badgeText: 'بدون نیاز به اقدام',
        mainAction:
          hcwHbvStatus === 'unvaccinated'
            ? 'برای این تماس دارویی لازم نیست، اما برای حفاظت شغلی در آینده واکسیناسیون هپاتیت B خود را کامل کنید.'
            : 'نیازی به تزریق HBIG، واکسن یا آزمایش نیست.',
        steps: [],
        tests: [],
      },
      hcv: {
        id: 'hcv',
        title: 'هپاتیت C',
        urgency: 'safe',
        badgeText: 'بدون نیاز به اقدام',
        mainAction: 'نیازی به دارو یا آزمایش پیگیری نیست.',
        steps: [],
        tests: [],
      },
      hiv: {
        id: 'hiv',
        title: 'HIV / ایدز',
        urgency: 'safe',
        badgeText: 'بدون نیاز به اقدام',
        mainAction: 'نیازی به داروی پیشگیری (PEP) یا آزمایش نیست.',
        steps: [],
        tests: [],
      },
    };
  }

  const effHbs: SerologyStatus = sourceKnowledge === 'known' ? sourceHbsAg : 'unknown';
  const effHcv: SerologyStatus = sourceKnowledge === 'known' ? sourceAntiHcv : 'unknown';
  const effHiv: SerologyStatus = sourceKnowledge === 'known' ? sourceHiv : 'unknown';

  const isPercutaneous = exposureType === 'percutaneous_high' || exposureType === 'percutaneous_low';
  const isHighRiskExposure = exposureType === 'percutaneous_high';

  // ==================== 1. هپاتیت B ====================
  let hbv: SimpleVirusAction;
  // در دستورالعمل کشوری، اگر وضعیت HBsAg منبع نامشخص است ولی بیمار/بخش High-Risk است، مشابه منبع مثبت با آن برخورد می‌شود
  const hbvPresumedPositive = effHbs === 'positive' || (effHbs === 'unknown' && sourceHighRisk);

  if (hcwHbvStatus === 'hbv_carrier') {
    hbv = {
      id: 'hbv',
      title: 'هپاتیت B',
      urgency: 'safe',
      badgeText: 'نیازی به دارو یا واکسن ندارد',
      mainAction: 'به دلیل مثبت بودن HBsAg پایه شما، تزریق HBIG یا واکسن تاثیری ندارد.',
      steps: [],
      tests: [],
    };
  } else if (hcwHbvStatus === 'vaccinated_responder') {
    hbv = {
      id: 'hbv',
      title: 'هپاتیت B',
      urgency: 'safe',
      badgeText: 'ایمن کامل — بدون نیاز به اقدام',
      mainAction: 'شما ایمن هستید. چه بیمار منبع مثبت باشد و چه منفی یا نامشخص (حتی پرخطر)، نیازی به HBIG یا یادآور واکسن ندارید.',
      steps: [],
      tests: [],
    };
  } else if (hcwHbvStatus === 'vaccinated_non_responder_2') {
    hbv = {
      id: 'hbv',
      title: 'هپاتیت B',
      urgency: hbvPresumedPositive && hbvWithin7d ? 'urgent' : effHbs === 'unknown' ? 'monitor' : 'safe',
      badgeText: hbvPresumedPositive
        ? hbvWithin7d
          ? 'تزریق ۲ نوبت HBIG'
          : 'پنجره ۷ روزه گذشته — فقط آزمایش'
        : effHbs === 'unknown'
          ? 'بررسی فوری HBsAg منبع (در صورت مثبت شدن: HBIG)'
          : 'بدون نیاز به دارو',
      mainAction: hbvPresumedPositive
        ? hbvWithin7d
          ? effHbs === 'positive'
            ? 'منبع HBsAg مثبت است: باید فوراً ۱ دوز ایمونوگلوبولین HBIG تزریق شود و دوز دوم دقیقاً ۱ ماه بعد تکرار گردد (واکسن مجدد زده نمی‌شود).'
            : 'با وجود نامشخص بودن وضعیت منبع، چون بیمار/بخش High-Risk است مشابه منبع مثبت عمل می‌شود: تزریق فوری ۱ دوز HBIG و تکرار دوز دوم ۱ ماه بعد (مگر اینکه تست منبع منفی شود).'
          : 'بیش از ۷ روز از مواجهه گذشته و HBIG اثربخشی ندارد؛ فقط پایش آزمایشگاهی انجام شود.'
        : effHbs === 'unknown'
          ? 'بیمار منبع وضعیت نامشخص دارد ولی High-Risk نیست: در صورت امکان تست HBsAg منبع فوراً چک شود؛ اگر منفی یا غیرقابل دسترس در تماس کم‌خطر باشد HBIG روتین لازم نیست، ولی اگر تست منبع مثبت شد فوراً HBIG دریافت کنید.'
          : 'منبع منفی است؛ نیازی به HBIG یا واکسن ندارید.',
      steps: hbvPresumedPositive && hbvWithin7d
        ? [
            'تزریق عضلانی دوز اول HBIG (0.06 mL/kg) ترجیحاً در ۲۴ ساعت اول (حداکثر تا ۷ روز).',
            'تزریق دوز دوم HBIG دقیقاً ۱ ماه بعد (در صورت منفی شدن قطعی منبع، دوز دوم لازم نیست).',
          ]
        : [],
      tests: hbvPresumedPositive || effHbs === 'unknown'
        ? ['روز صفر (پایه): HBsAg و Anti-HBc', 'ماه ۶: تکرار HBsAg و Anti-HBc']
        : [],
    };
  } else if (hcwHbvStatus === 'vaccinated_non_responder_1') {
    hbv = {
      id: 'hbv',
      title: 'هپاتیت B',
      urgency: hbvPresumedPositive && hbvWithin7d ? 'urgent' : 'monitor',
      badgeText: hbvPresumedPositive && hbvWithin7d ? 'تزریق HBIG + تکرار ۳ دوز واکسن' : 'تکرار ۳ دوز واکسن',
      mainAction:
        hbvPresumedPositive && hbvWithin7d
          ? effHbs === 'positive'
            ? 'فوراً ۱ دوز HBIG تزریق کنید و همزمان یک دوره جدید کامل ۳ نوبته واکسن هپاتیت B را شروع نمایید.'
            : 'به دلیل نامشخص بودن منبع در شرایط High-Risk، مشابه منبع مثبت ۱ دوز HBIG فوری تزریق کنید و دوره کامل ۳ نوبته واکسن را تکرار نمایید.'
          : effHbs === 'unknown'
            ? 'منبع وضعیت نامشخص دارد ولی High-Risk نیست: نیازی به HBIG فوری نیست (مگر آزمایش منبع مثبت شود)، اما باید دوره کامل ۳ نوبته واکسن هپاتیت B را تکرار کنید.'
            : 'یک دوره جدید کامل ۳ نوبته واکسن هپاتیت B (ماه‌های ۰، ۱ و ۶) را دریافت کنید (HBIG نیاز نیست).',
      steps: [
        ...(hbvPresumedPositive && hbvWithin7d
          ? ['تزریق عضلانی HBIG با دوز 0.06 mL/kg (در عضله‌ای جدا از محل تزریق واکسن).']
          : []),
        'تزریق ۳ نوبت واکسن هپاتیت B در عضله بازو (امروز، ۱ ماه بعد و ۶ ماه بعد).',
      ],
      tests: ['۱ تا ۲ ماه بعد از آخرین دوز واکسن: چک مجدد تیتر Anti-HBs'],
    };
  } else if (hcwHbvStatus === 'vaccinated_unknown_titer') {
    hbv = {
      id: 'hbv',
      title: 'هپاتیت B',
      urgency: hbvPresumedPositive ? 'urgent' : 'monitor',
      badgeText: hbvPresumedPositive ? 'آزمایش فوری تیتر Anti-HBs (آمادگی برای HBIG)' : 'آزمایش فوری تیتر Anti-HBs',
      mainAction: hbvPresumedPositive
        ? 'همین امروز تیتر Anti-HBs شما چک شود. اگر تیتر ≥ ۱۰ بود اقدامی لازم نیست؛ ولی اگر زیر ۱۰ بود (یا جواب سریع آماده نمی‌شود در منبع مثبت/High-Risk)، باید فوراً ۱ دوز HBIG + ۱ دوز یادآور واکسن دریافت کنید.'
        : 'همین امروز تیتر Anti-HBs شما چک شود. اگر تیتر ≥ ۱۰ بود هیچ اقدامی لازم نیست؛ اگر زیر ۱۰ بود ۱ دوز یادآور واکسن دریافت کنید (در منبع نامشخص غیرپرخطر، HBIG فوری لازم نیست).',
      steps: [
        hbvPresumedPositive
          ? 'در صورت تیتر < ۱۰ (یا نبود امکان جواب سریع): تزریق ۱ دوز HBIG (0.06 mL/kg) + ۱ دوز یادآور واکسن.'
          : 'در صورت تیتر < ۱۰: تزریق ۱ دوز یادآور واکسن هپاتیت B.',
      ],
      tests: ['امروز: آزمایش تیتر Anti-HBs', '۱ تا ۲ ماه بعد از یادآور (در صورت نیاز): چک مجدد تیتر'],
    };
  } else {
    // unvaccinated
    hbv = {
      id: 'hbv',
      title: 'هپاتیت B',
      urgency: hbvPresumedPositive && hbvWithin7d ? 'urgent' : 'monitor',
      badgeText: hbvPresumedPositive && hbvWithin7d ? 'تزریق HBIG + شروع واکسیناسیون' : 'شروع / تکمیل واکسیناسیون',
      mainAction:
        hbvPresumedPositive && hbvWithin7d
          ? effHbs === 'positive'
            ? 'فوراً ۱ دوز HBIG تزریق کنید و دوره واکسیناسیون هپاتیت B را شروع یا تکمیل نمایید.'
            : 'چون وضعیت منبع نامشخص است ولی بیمار/بخش High-Risk محسوب می‌شود، مشابه منبع مثبت باید فوراً ۱ دوز HBIG تزریق شود و واکسیناسیون هپاتیت B شروع/تکمیل گردد.'
          : effHbs === 'unknown'
            ? 'وضعیت منبع نامشخص است ولی High-Risk نیست: دوره واکسیناسیون ۳ نوبته هپاتیت B را فوراً شروع/تکمیل کنید (تزریق HBIG لازم نیست مگر جواب منبع مثبت شود).'
            : 'منبع منفی است؛ HBIG نیاز نیست، اما دوره واکسیناسیون ۳ نوبته هپاتیت B را فوراً شروع یا تکمیل کنید.',
      steps: [
        ...(hbvPresumedPositive && hbvWithin7d
          ? ['تزریق عضلانی HBIG (0.06 mL/kg) ترجیحاً ظرف ۲۴ ساعت (در عضله‌ای مجزا از واکسن).']
          : []),
        'تزریق واکسن هپاتیت B در نوبت‌های ۰ (امروز)، ۱ ماه و ۶ ماه بعد.',
      ],
      tests: [
        'روز صفر: آزمایش پایه HBsAg و Anti-HBc',
        '۱ تا ۲ ماه بعد از دوز سوم واکسن: چک تیتر Anti-HBs',
      ],
    };
  }

  // ==================== 2. هپاتیت C ====================
  let hcv: SimpleVirusAction;
  const hcvRisk = effHcv === 'positive' || effHcv === 'unknown' || sourceHighRisk;

  if (!hcvRisk) {
    hcv = {
      id: 'hcv',
      title: 'هپاتیت C',
      urgency: 'safe',
      badgeText: 'بدون نیاز به اقدام',
      mainAction: 'بیمار منبع منفی است و نیازی به دارو یا پیگیری روتین هپاتیت C نیست.',
      steps: [],
      tests: [],
    };
  } else {
    hcv = {
      id: 'hcv',
      title: 'هپاتیت C',
      urgency: 'monitor',
      badgeText:
        effHcv === 'unknown' && !sourceHighRisk
          ? 'بررسی منبع + پایش آزمایشگاهی (دارو یا واکسن ندارد)'
          : 'پایش آزمایشگاهی فعال (دارو یا واکسن ندارد)',
      mainAction:
        effHcv === 'unknown' && sourceHighRisk
          ? 'به دلیل نامشخص بودن منبع در شرایط High-Risk، ریسک هپاتیت C جدی تلقی می‌شود؛ پایش کامل آزمایشگاهی (به‌ویژه HCV RNA در هفته ۴–۶) الزامی است. هپاتیت C واکسن یا PEP ندارد ولی در صورت ابتلا درمان قطعی خوراکی دارد.'
          : 'هپاتیت C واکسن یا داروی پیشگیری (PEP) ندارد؛ اما در صورت انتقال، با آزمایش زودهنگام و داروهای خوراکی جدید بیش از ۹۵٪ درمان قطعی می‌شود.',
      steps: [
        'در صورت منفی شدن قطعی آزمایش منبع (بدون رفتار پرخطر)، پیگیری متوقف می‌شود.',
        'در صورت مثبت شدن HCV RNA طی پیگیری، ارجاع فوری به متخصص عفونی/گوارش برای شروع درمان قطعی (DAAs).',
      ],
      tests: [
        'روز صفر (ظرف ۴۸ ساعت): Anti-HCV + ALT/AST',
        'هفته ۴ تا ۶: آزمایش HCV RNA (PCR)',
        'ماه ۳ و ماه ۶: تکرار Anti-HCV + ALT',
      ],
    };
  }

  // ==================== 3. HIV / ایدز ====================
  let hiv: SimpleVirusAction;

  // طبق دستورالعمل وزارت بهداشت:
  // ۱. منبع HIV مثبت -> PEP قطعی
  // ۲. منبع HIV نامشخص ولی High-Risk -> شروع فوری PEP (تا زمانی که منبع منفی شود)
  // ۳. منبع HIV نامشخص ولی غیرپرخطر (ریسک معمولی) -> اگر جراحت عمیق خون‌آلود باشد مشاوره فوری برای PEP موقت/تست منبع؛ اگر تماس کم‌خطر باشد معمولاً PEP روتین لازم نیست (مشاوره موردی)
  // ۴. منبع ظاهراً منفی ولی High-Risk (احتمال دوره پنجره) -> مشاوره فوری عفونی برای HCV/HIV RNA و ارزیابی PEP در تماس پرخطر
  const pepImmediate = effHiv === 'positive' || (effHiv === 'unknown' && sourceHighRisk);
  const pepConsult =
    (effHiv === 'unknown' && !sourceHighRisk) ||
    (effHiv === 'negative' && sourceHighRisk);

  const drugSteps: string[] = [
    hasRenalDisease
      ? 'رژیم با احتیاط کلیوی: جایگزینی TDF با TAF/FTC (یا تنظیم دوز) با نظر متخصص عفونی پس از چک کراتینین.'
      : 'قرص Tenofovir 300mg + Emtricitabine 200mg (ترووادا، یا TDF + 3TC): روزی ۱ عدد.',
    isPregnantOrBreastfeeding
      ? 'به همراه قرص Dolutegravir 50mg روزی ۱ عدد (یا Raltegravir 400mg هر ۱۲ ساعت) با هماهنگی پزشک مرکز مشاوره بیماری‌های رفتاری.'
      : 'به همراه قرص Dolutegravir 50mg: روزی ۱ عدد.',
    'مدت مصرف: ۲۸ روز کامل بدون وقفه (دریافت بسته اولیه از اورژانس بیمارستان و ادامه رایگان از مرکز مشاوره بیماری‌های رفتاری).',
  ];

  if (effHiv === 'negative' && !sourceHighRisk) {
    hiv = {
      id: 'hiv',
      title: 'HIV / ایدز',
      urgency: 'safe',
      badgeText: 'بدون نیاز به دارو (PEP)',
      mainAction: 'بیمار منبع HIV منفی است و سابقه High-Risk ندارد؛ نیازی به مصرف داروهای پیشگیری (PEP) نیست.',
      steps: [],
      tests: [],
    };
  } else if (!hivWithin72h) {
    hiv = {
      id: 'hiv',
      title: 'HIV / ایدز',
      urgency: 'monitor',
      badgeText: 'گذشت مهلت ۷۲ ساعته — فقط پیگیری آزمایشگاهی',
      mainAction:
        'چون بیش از ۷۲ ساعت از مواجهه گذشته، شروع داروی پروفیلاکسی (PEP) اثربخش نیست و تجویز نمی‌شود؛ اما باید آزمایش‌های پایش HIV را انجام دهید.',
      steps: ['مراجعه و ثبت پرونده در مرکز مشاوره بیماری‌های رفتاری جهت پیگیری آزمایش‌ها.'],
      tests: ['امروز (پایه): الایزای HIV نسل ۴', 'هفته ۶، ماه ۳ و ماه ۶: تکرار الایزای HIV نسل ۴'],
    };
  } else if (pepImmediate) {
    hiv = {
      id: 'hiv',
      title: 'HIV / ایدز',
      urgency: 'urgent',
      badgeText:
        timeWindow === 'under_2h'
          ? 'شروع فوری داروی PEP (زمان طلایی ۲ ساعته)'
          : 'شروع فوری داروی PEP (تا قبل از ۷۲ ساعت)',
      mainAction:
        effHiv === 'positive'
          ? 'بیمار منبع HIV مثبت است: درمان پیشگیری سه‌دارویی (PEP) باید همین الان و بدون معطلی شروع شود و ۲۸ روز ادامه یابد.'
          : 'وضعیت HIV منبع نامشخص است ولی بیمار/بخش High-Risk محسوب می‌شود: طبق دستورالعمل وزارت بهداشت، داروی PEP باید فوراً شروع شود و همزمان تست منبع پیگیری گردد (در صورت منفی شدن قطعی منبع بدون دوره پنجره، دارو قطع می‌شود).',
      steps: drugSteps,
      tests: [
        'پیش از دوز اول: HIV نسل ۴، CBC، کراتینین، ALT/AST و تست بارداری (در خانم‌ها)',
        'هفته ۲: بررسی عوارض دارو و آزمایش مجدد',
        'هفته ۴ تا ۶، ماه ۳ و ماه ۶: تکرار آزمایش HIV نسل ۴',
      ],
    };
  } else if (pepConsult) {
    const isUnknownNonHighRiskDeep = effHiv === 'unknown' && !sourceHighRisk && isHighRiskExposure;
    const isUnknownNonHighRiskLow = effHiv === 'unknown' && !sourceHighRisk && !isHighRiskExposure;
    hiv = {
      id: 'hiv',
      title: 'HIV / ایدز',
      urgency: 'monitor',
      badgeText: isUnknownNonHighRiskLow
        ? 'تست سریع منبع — معمولاً بدون نیاز به PEP مگر نظر عفونی'
        : 'مشاوره فوری عفونی / تصمیم‌گیری PEP تا آماده شدن تست منبع',
      mainAction:
        effHiv === 'negative'
          ? 'با وجود منفی بودن آزمایش منبع، به دلیل High-Risk بودن بیمار (احتمال دوره پنجره)، با متخصص عفونی برای بررسی HIV RNA منبع و نیاز احتمالی به PEP در تماس پرخطر مشورت شود.'
          : isUnknownNonHighRiskDeep
            ? 'وضعیت HIV منبع نامشخص است ولی بیمار/بخش High-Risk نیست: چون جراحت عمیق/خون‌آلود بوده، فوراً آزمایش سریع HIV از منبع بگیرید؛ اگر جواب منبع بیش از چند ساعت طول می‌کشد، با نظر پزشک کنترل عفونت می‌توانید PEP را شروع کرده و با منفی شدن منبع قطع کنید.'
            : 'وضعیت HIV منبع نامشخص است ولی بیمار/بخش High-Risk نیست و تماس نیز کم‌خطر است: اولویت با تست سریع بیمار منبع است. معمولاً در این شرایط شروع روتین PEP توصیه نمی‌شود (مگر با نظر پزشک عفونی و تمایل پرسنل پس از مشاوره).',
      steps: isUnknownNonHighRiskLow
        ? ['اقدام فوری برای آزمایش HIV بیمار منبع (در صورت دسترسی).', 'در صورت مثبت شدن تست منبع: شروع فوری رژیم ۲۸ روزه PEP (قبل از ۷۲ ساعت).']
        : [
            'اقدام فوری برای آزمایش سریع HIV از بیمار منبع.',
            'در صورت تاخیر در جواب منبع یا صلاحدید پزشک عفونی: شروع رژیم ۲۸ روزه TDF/FTC + Dolutegravir 50mg.',
          ],
      tests: ['روز صفر (پایه): الایزای HIV نسل ۴', 'هفته ۶ و ماه ۳ (و در صورت نیاز ماه ۶): تکرار HIV'],
    };
  } else {
    hiv = {
      id: 'hiv',
      title: 'HIV / ایدز',
      urgency: 'safe',
      badgeText: 'بدون نیاز به دارو',
      mainAction: 'نیازی به داروی پیشگیری (PEP) نیست.',
      steps: [],
      tests: [],
    };
  }

  const urgencies: UrgencyLevel[] = [hbv.urgency, hcv.urgency, hiv.urgency];
  const overallUrgency: UrgencyLevel = urgencies.includes('urgent')
    ? 'urgent'
    : urgencies.includes('monitor')
      ? 'monitor'
      : 'safe';

  return {
    isZeroRisk: false,
    overallUrgency,
    firstAidSteps,
    prohibitedSteps,
    hbv,
    hcv,
    hiv,
  };
}
