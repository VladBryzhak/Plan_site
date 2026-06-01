/* =====================
   data.js — дані плану (v4)
   Структура страв: items[] з base-порціями і type-мітками
   type: 'protein' | 'carb' | 'fat' | 'veggie'
   fixed: true — не масштабується (фрукти, цілі одиниці)
   ===================== */

const DAYS_META = [
  { label: 'Пн', type: 'teal',  short: 'Верхня A'   },
  { label: 'Вт', type: 'blue',  short: 'Кардіо+кор' },
  { label: 'Ср', type: 'gray',  short: 'Відпочинок'  },
  { label: 'Чт', type: 'coral', short: 'Ноги'        },
  { label: 'Пт', type: 'gray',  short: 'Відпочинок'  },
  { label: 'Сб', type: 'teal',  short: 'Верхня B'   },
  { label: 'Нд', type: 'blue',  short: 'Пробіжка'   },
];

/* Базова калорійність вихідного плану (для масштабування) */
const BASE_CAL = 2100;

const WORKOUTS = {
  0: {
    title: 'Понеділок — верхня частина A',
    sub:   'Груди · Трицепс · Плечі',
    type:  'teal',
    icon:  '🏋',
    exercises: [
      { name: 'Жим гантелей лежачи (підлога)', videos: ['-cpfMqSGxvg', 'vagdk94bFn4', 'qHCI9rK7HqM'], tip: 'Лікті під кутом 45° від тіла, лопатки зведені' },
      { name: 'Зведення гантелей лежачи', videos: ['L8MRBMGl7gc', '98aRvyw-IGg', 'LBpdPSivCb4'], tip: 'Легкий згин у ліктях, рух ніби "обіймаєш дерево"' },
      { name: 'Жим гантелей стоячи (плечі)', videos: ['bmy7tIopNt4', '6eDlfTDb7Po', 'fYeUxGIjZyc'], tip: 'Корпус прямий, не прогинай поперек, жми строго вгору' },
      { name: 'Розведення гантелей в сторони', videos: ['nnH63icHYXY', 'Y29xKcze8Ik', 'pgrWjBfaFe8'], tip: 'Підіймай до рівня плечей, не використовуй інерцію' },
      { name: 'Французький жим (трицепс)', videos: ['N5ImCU0mcpo', 'jO2Jl9eZpXk'], tip: 'Лікті нерухомі, опускай гантелі до вух' },
      { name: 'Віджимання (широка постановка)' },
    ],
  },
  1: {
    title: 'Вівторок — кардіо + кор',
    sub:   'Пробіжка · Прес',
    type:  'blue',
    icon:  '🏃',
    cardio: true,
    exercises: [
      { name: 'Розминка — ходьба', fixedSets: '5 хв' },
      { name: 'Біг у спокійному темпі', fixedSets: '20–25 хв' },
      { name: 'Планка класична', fixedSets: '3 × 45–60 сек' },
      { name: 'Скручування', fixedSets: '3 × 20' },
      { name: 'Підйом ніг лежачи', fixedSets: '3 × 15' },
      { name: 'Бокова планка', fixedSets: '2 × 30 сек × 2 боки' },
    ],
  },
  2: {
    title: 'Середа — відпочинок',
    sub:   'Активне відновлення',
    type:  'gray',
    icon:  '😴',
    exercises: [ { name: 'Прогулянка або легка розтяжка', fixedSets: 'за бажанням' } ],
  },
  3: {
    title: 'Четвер — нижня частина',
    sub:   'Ноги · Сідниці',
    type:  'coral',
    icon:  '🦵',
    exercises: [
      { name: 'Присідання з гантелями', videos: ['QSleSxhvs7s', 'ZXwvmRSRRxY', 'MJao9o7ROs0'], tip: 'Стопи на ширині плечей, спина пряма, до паралелі стегон' },
      { name: 'Випади з гантелями (крок)', videos: ['_DLIS8SySzs', 'pT7K8D8SLk4', 'G4gAK8Bhyro'], tip: 'Переднє коліно над щиколоткою, велика амплітуда' },
      { name: 'Румунська тяга з гантелями', videos: ['KYIJdN2gBmQ', '68DCrZYEtus', 'RApyTtH6qAo'], tip: 'Відводь таз назад, спина рівна, відчувай розтяжку' },
      { name: 'Підйом на носки стоячи', videos: ['SRUtMJ0tE2A', '8OEElRS3GPk', 'wxwY7GXxL4k'], tip: 'Повна амплітуда, пауза вгорі' },
      { name: 'Ягідний місток (з гантеллю)', videos: ['29OfN4ztW_g', 'PSMW7iSi2BU', 'QPGoPkWhPJ8'], tip: 'Штовхай через п\'яти, стискай сідниці вгорі 1–2 сек' },
      { name: 'Бічні кроки з гантелями' },
    ],
  },
  4: {
    title: "П'ятниця — відпочинок",
    sub:   'Активне відновлення',
    type:  'gray',
    icon:  '😴',
    exercises: [ { name: 'Прогулянка або легка розтяжка', fixedSets: 'за бажанням' } ],
  },
  5: {
    title: 'Субота — верхня частина B',
    sub:   'Спина · Біцепс',
    type:  'teal',
    icon:  '🏋',
    exercises: [
      { name: 'Тяга гантелі в нахилі (одна рука)', videos: ['fURsHPHgssI', 'OG5S3x7T8QQ', 'W3fZzhw87ak'], tip: 'Тягни ліктем вгору і назад, зведи лопатку' },
      { name: 'Тяга двох гантелей в нахилі', videos: ['c-gt-zzoa_A', 'ayBUERt_w6g', 'PFTMBwL3GV0'], tip: 'Корпус 45°, лікті вздовж тіла, тягни до живота' },
      { name: 'Підтягування або австралійські' },
      { name: 'Підйом гантелей на біцепс', videos: ['XE_pHwbst04', '6DeLZ6cbgWQ', 'in7PaeYlhrM'], tip: 'Лікті притиснуті до тіла, не гойдайся' },
      { name: 'Молоткові згинання', videos: ['8XLxfXROrTo', 'EWWKFb0q0Uc', 'BRVDS6HVR9Q'], tip: 'Нейтральний хват, рухаються лише передпліччя' },
      { name: 'Шраги з гантелями (трапеція)', videos: ['YJ2q8RkOFVw', 'qvvJUKq7_sU'], tip: 'Піднімай плечі строго вгору, пауза 1–2 сек' },
    ],
  },
  6: {
    title: 'Неділя — легке кардіо',
    sub:   'Пробіжка або прогулянка',
    type:  'blue',
    icon:  '🏃',
    cardio: true,
    exercises: [
      { name: 'Прогулянка або легкий біг', fixedSets: '30–40 хв' },
      { name: 'Розтяжка всього тіла', fixedSets: '10 хв' },
    ],
  },
};

/* ---- Дані для .ics календаря ---- */
const CAL_DESCRIPTIONS = {
  0: 'Жим гантелей лежачи\nЗведення гантелей\nЖим плечей\nРозведення в сторони\nФранцузький жим\nВіджимання',
  1: 'Розминка 5хв\nБіг 20-25хв\nПланка 3x45-60сек\nСкручування 3x20\nПідйом ніг 3x15\nБокова планка 2x30сек',
  3: 'Присідання\nВипади\nРумунська тяга\nПідйом на носки\nЯгідний місток\nБічні кроки',
  5: 'Тяга в нахилі\nТяга двох гантелей\nПідтягування\nБіцепс\nМолоток\nШраги',
  6: 'Легкий біг або прогулянка 30-40хв\nРозтяжка 10хв',
};

const CAL_EVENTS = [
  { dayOffset: 0, title: 'Тренування: Верхня A (груди, плечі, трицепс)', dur: 50, descKey: 0 },
  { dayOffset: 1, title: 'Тренування: Кардіо + кор',                     dur: 40, descKey: 1 },
  { dayOffset: 3, title: 'Тренування: Ноги і сідниці',                   dur: 50, descKey: 3 },
  { dayOffset: 5, title: 'Тренування: Верхня B (спина, біцепс)',          dur: 50, descKey: 5 },
  { dayOffset: 6, title: 'Тренування: Легкий біг / прогулянка',          dur: 35, descKey: 6 },
];

/* =====================
   ХАРЧУВАННЯ — items[] зі структурою
   ===================== */

const WEEK1 = [
  { day: 'Понеділок', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з сиром', items: [
      { name: 'вівсяних пластівців', base: 80, unit: 'г', type: 'carb' },
      { name: 'сиру 0–2%', base: 200, unit: 'г', type: 'protein' },
      { name: 'яблуко', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Грецький йогурт + горіхи', items: [
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'мигдалю', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Обід 13:00', n: 'Курка з гречкою', items: [
      { name: 'курячої грудки', base: 220, unit: 'г', type: 'protein' },
      { name: 'гречки', base: 150, unit: 'г', type: 'carb' },
      { name: 'огірок', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Сир + фрукт', items: [
      { name: 'сиру 0–2%', base: 200, unit: 'г', type: 'protein' },
      { name: 'яблуко', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Вечеря 19:00', n: 'Риба з овочами', items: [
      { name: 'тріски/тунця', base: 200, unit: 'г', type: 'protein' },
      { name: 'тушкованих овочів', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Вівторок', meals: [
    { t: 'Сніданок 7:30', n: 'Гречана каша з сиром', items: [
      { name: 'гречки', base: 100, unit: 'г', type: 'carb' },
      { name: 'сиру', base: 150, unit: 'г', type: 'protein' },
      { name: 'огірок', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Кефір + горіхи', items: [
      { name: 'кефіру 1%', base: 300, unit: 'мл', type: 'protein' },
      { name: 'волоських горіхів', base: 25, unit: 'г', type: 'fat' } ] },
    { t: 'Обід 13:00', n: 'Яловичина з рисом', items: [
      { name: 'нежирної яловичини', base: 200, unit: 'г', type: 'protein' },
      { name: 'рису', base: 150, unit: 'г', type: 'carb' },
      { name: 'салат', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Грецький йогурт', items: [
      { name: 'грецького йогурту', base: 250, unit: 'г', type: 'protein' },
      { name: 'ягід', base: 50, unit: 'г', type: 'veggie' } ] },
    { t: 'Вечеря 19:00', n: 'Курка з броколі', items: [
      { name: 'курки на парі', base: 220, unit: 'г', type: 'protein' },
      { name: 'броколі', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Середа', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з йогуртом', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'банан', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Сир + груша', items: [
      { name: 'сиру 0–2%', base: 200, unit: 'г', type: 'protein' },
      { name: 'груша', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Обід 13:00', n: 'Індичка з картоплею', items: [
      { name: 'індички', base: 200, unit: 'г', type: 'protein' },
      { name: 'картоплі', base: 200, unit: 'г', type: 'carb' },
      { name: 'салат', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Кефір + горіхи', items: [
      { name: 'кефіру', base: 250, unit: 'мл', type: 'protein' },
      { name: 'мигдалю', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Вечеря 19:00', n: 'Риба запечена', items: [
      { name: 'лосося/тунця', base: 200, unit: 'г', type: 'protein' },
      { name: 'зелених овочів', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Четвер', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з сиром і медом', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'меду', base: 15, unit: 'г', type: 'carb' } ] },
    { t: 'Перекус 10:30', n: 'Грецький йогурт + ягоди', items: [
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'ягід', base: 100, unit: 'г', type: 'veggie' } ] },
    { t: 'Обід 13:00', n: 'Курка з гречкою', items: [
      { name: 'курки', base: 220, unit: 'г', type: 'protein' },
      { name: 'гречки', base: 150, unit: 'г', type: 'carb' },
      { name: 'квашена капуста', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Кефір', items: [
      { name: 'кефіру 1%', base: 300, unit: 'мл', type: 'protein' } ] },
    { t: 'Вечеря 19:00', n: 'Тунець з овочами', items: [
      { name: 'тунця (у власному соку)', base: 200, unit: 'г', type: 'protein' },
      { name: 'овочевого салату', base: 250, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: "П'ятниця", meals: [
    { t: 'Сніданок 7:30', n: 'Гречана каша з йогуртом', items: [
      { name: 'гречки', base: 100, unit: 'г', type: 'carb' },
      { name: 'грецького йогурту', base: 150, unit: 'г', type: 'protein' } ] },
    { t: 'Перекус 10:30', n: 'Сир + яблуко', items: [
      { name: 'сиру 0–2%', base: 200, unit: 'г', type: 'protein' },
      { name: 'яблуко', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Обід 13:00', n: 'Яловичина з бурим рисом', items: [
      { name: 'яловичини', base: 200, unit: 'г', type: 'protein' },
      { name: 'бурого рису', base: 130, unit: 'г', type: 'carb' },
      { name: 'овочів', base: 150, unit: 'г', type: 'veggie' } ] },
    { t: 'Перекус 16:00', n: 'Кефір + горіхи', items: [
      { name: 'кефіру', base: 250, unit: 'мл', type: 'protein' },
      { name: 'кешью', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Вечеря 19:00', n: 'Курка з кабачками', items: [
      { name: 'курки', base: 220, unit: 'г', type: 'protein' },
      { name: 'тушкованих кабачків', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Субота', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з горіхами і сиром', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'волоських горіхів', base: 20, unit: 'г', type: 'fat' },
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' } ] },
    { t: 'Перекус 10:30', n: 'Грецький йогурт + апельсин', items: [
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'апельсин', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Обід 13:00', n: 'Нежирна свинина з гречкою', items: [
      { name: 'нежирної свинини', base: 180, unit: 'г', type: 'protein' },
      { name: 'гречки', base: 150, unit: 'г', type: 'carb' },
      { name: 'салат', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Сир', items: [
      { name: 'сиру 0–2%', base: 200, unit: 'г', type: 'protein' } ] },
    { t: 'Вечеря 19:00', n: 'Риба + овочі гриль', items: [
      { name: 'тріски/лосося', base: 200, unit: 'г', type: 'protein' },
      { name: 'овочевого міксу на грилі', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Неділя', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з бананом і сиром', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'банан', base: 1, unit: 'шт', fixed: true },
      { name: 'сиру', base: 150, unit: 'г', type: 'protein' } ] },
    { t: 'Перекус 10:30', n: 'Кефір + горіхи', items: [
      { name: 'кефіру 1%', base: 300, unit: 'мл', type: 'protein' },
      { name: 'горіхів', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Обід 13:00', n: 'Курка з овочевим рагу', items: [
      { name: 'курки', base: 220, unit: 'г', type: 'protein' },
      { name: 'рагу з кабачків і морквини', base: 300, unit: 'г', type: 'veggie' } ] },
    { t: 'Перекус 16:00', n: 'Грецький йогурт + ягоди', items: [
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'ягід', base: 100, unit: 'г', type: 'veggie' } ] },
    { t: 'Вечеря 19:00', n: 'Тунець з зеленим салатом', items: [
      { name: 'тунця', base: 200, unit: 'г', type: 'protein' },
      { name: 'салату з оливковою олією', base: 200, unit: 'г', type: 'veggie' } ] },
  ]},
];

const WEEK2 = [
  { day: 'Понеділок', meals: [
    { t: 'Сніданок 7:30', n: 'Пшоняна каша з йогуртом', items: [
      { name: 'пшона', base: 80, unit: 'г', type: 'carb' },
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'яблуко', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Сир + горіхи', items: [
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'мигдалю', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Обід 13:00', n: 'Індичка з бурим рисом', items: [
      { name: 'індички', base: 200, unit: 'г', type: 'protein' },
      { name: 'бурого рису', base: 150, unit: 'г', type: 'carb' },
      { name: 'броколі', base: 150, unit: 'г', type: 'veggie' } ] },
    { t: 'Перекус 16:00', n: 'Кефір', items: [
      { name: 'кефіру 1%', base: 300, unit: 'мл', type: 'protein' } ] },
    { t: 'Вечеря 19:00', n: 'Риба з овочами', items: [
      { name: 'тріски', base: 200, unit: 'г', type: 'protein' },
      { name: 'тушкованих кабачків', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Вівторок', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з сиром', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'апельсин', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Грецький йогурт + ягоди', items: [
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'ягід', base: 100, unit: 'г', type: 'veggie' } ] },
    { t: 'Обід 13:00', n: 'Курка з гречкою', items: [
      { name: 'курки', base: 220, unit: 'г', type: 'protein' },
      { name: 'гречки', base: 150, unit: 'г', type: 'carb' },
      { name: 'морквяний салат', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Сир + фрукт', items: [
      { name: 'сиру', base: 150, unit: 'г', type: 'protein' },
      { name: 'груша', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Вечеря 19:00', n: 'Яловичина з овочами', items: [
      { name: 'яловичини відвареної', base: 200, unit: 'г', type: 'protein' },
      { name: 'тушкованих овочів', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Середа', meals: [
    { t: 'Сніданок 7:30', n: 'Гречана каша з кефіром', items: [
      { name: 'гречки', base: 100, unit: 'г', type: 'carb' },
      { name: 'кефіру', base: 250, unit: 'мл', type: 'protein' },
      { name: 'огірок', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Грецький йогурт + горіхи', items: [
      { name: 'йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'волоських горіхів', base: 25, unit: 'г', type: 'fat' } ] },
    { t: 'Обід 13:00', n: 'Нежирна свинина з гречкою', items: [
      { name: 'свинини', base: 180, unit: 'г', type: 'protein' },
      { name: 'гречки', base: 150, unit: 'г', type: 'carb' },
      { name: 'квашена капуста', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Сир', items: [
      { name: 'сиру 0–2%', base: 200, unit: 'г', type: 'protein' } ] },
    { t: 'Вечеря 19:00', n: 'Курка з броколі', items: [
      { name: 'курячої грудки', base: 220, unit: 'г', type: 'protein' },
      { name: 'броколі на парі', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Четвер', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з йогуртом і бананом', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'банан', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Сир + яблуко', items: [
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'яблуко', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Обід 13:00', n: 'Риба запечена з рисом', items: [
      { name: 'лосося', base: 200, unit: 'г', type: 'protein' },
      { name: 'рису', base: 130, unit: 'г', type: 'carb' },
      { name: 'салат', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Кефір + горіхи', items: [
      { name: 'кефіру', base: 250, unit: 'мл', type: 'protein' },
      { name: 'мигдалю', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Вечеря 19:00', n: 'Тунець з овочами', items: [
      { name: 'тунця', base: 200, unit: 'г', type: 'protein' },
      { name: 'тушкованого перцю і цибулі', base: 250, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: "П'ятниця", meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з сиром', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'груша', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Грецький йогурт + ягоди', items: [
      { name: 'йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'ягід', base: 100, unit: 'г', type: 'veggie' } ] },
    { t: 'Обід 13:00', n: 'Індичка з картоплею', items: [
      { name: 'індички', base: 200, unit: 'г', type: 'protein' },
      { name: 'картоплі', base: 200, unit: 'г', type: 'carb' },
      { name: 'зелень', base: 1, unit: 'порція', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Кефір', items: [
      { name: 'кефіру 1%', base: 300, unit: 'мл', type: 'protein' } ] },
    { t: 'Вечеря 19:00', n: 'Риба + зелений салат', items: [
      { name: 'тунця/тріски', base: 200, unit: 'г', type: 'protein' },
      { name: 'овочевого салату', base: 250, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Субота', meals: [
    { t: 'Сніданок 7:30', n: 'Гречана каша з сиром', items: [
      { name: 'гречки', base: 100, unit: 'г', type: 'carb' },
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'огірок', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 10:30', n: 'Кефір + горіхи', items: [
      { name: 'кефіру', base: 300, unit: 'мл', type: 'protein' },
      { name: 'кешью', base: 20, unit: 'г', type: 'fat' } ] },
    { t: 'Обід 13:00', n: 'Яловичина з гречкою', items: [
      { name: 'яловичини', base: 200, unit: 'г', type: 'protein' },
      { name: 'гречки', base: 150, unit: 'г', type: 'carb' },
      { name: 'свіжих овочів', base: 150, unit: 'г', type: 'veggie' } ] },
    { t: 'Перекус 16:00', n: 'Грецький йогурт', items: [
      { name: 'грецького йогурту', base: 200, unit: 'г', type: 'protein' } ] },
    { t: 'Вечеря 19:00', n: 'Курка з кабачками', items: [
      { name: 'курки', base: 220, unit: 'г', type: 'protein' },
      { name: 'запечених кабачків з часником', base: 300, unit: 'г', type: 'veggie' } ] },
  ]},
  { day: 'Неділя', meals: [
    { t: 'Сніданок 7:30', n: 'Вівсянка з горіхами і медом', items: [
      { name: 'вівсянки', base: 80, unit: 'г', type: 'carb' },
      { name: 'горіхів', base: 25, unit: 'г', type: 'fat' },
      { name: 'меду', base: 15, unit: 'г', type: 'carb' } ] },
    { t: 'Перекус 10:30', n: 'Сир + фрукт', items: [
      { name: 'сиру', base: 200, unit: 'г', type: 'protein' },
      { name: 'яблуко', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Обід 13:00', n: 'Риба з рисом', items: [
      { name: 'лосося', base: 200, unit: 'г', type: 'protein' },
      { name: 'бурого рису', base: 130, unit: 'г', type: 'carb' },
      { name: 'огірок', base: 1, unit: 'шт', fixed: true } ] },
    { t: 'Перекус 16:00', n: 'Грецький йогурт + ягоди', items: [
      { name: 'йогурту', base: 200, unit: 'г', type: 'protein' },
      { name: 'ягід', base: 100, unit: 'г', type: 'veggie' } ] },
    { t: 'Вечеря 19:00', n: 'Тунець + овочевий салат', items: [
      { name: 'тунця', base: 200, unit: 'г', type: 'protein' },
      { name: 'салату з оливковою олією', base: 200, unit: 'г', type: 'veggie' } ] },
  ]},
];

/* =====================
   КОНСТАНТИ РОЗРАХУНКІВ
   ===================== */

const ACTIVITY_FACTORS = {
  sedentary: 1.20,
  moderate:  1.55,
  active:    1.725,
};

const GOALS = {
  cut:    { label: 'Схуднення', icon: '🔥', calAdjust: -500, macros: { p: 0.35, c: 0.35, f: 0.30 },
            sets: 4, reps: '12–15', rest: '60 сек', note: 'Акцент на кардіо між підходами',
            portionScale: { protein: 1.0, carb: 0.85, fat: 0.9, veggie: 1.1 } },
  bulk:   { label: 'Набір маси', icon: '💪', calAdjust: 300, macros: { p: 0.30, c: 0.45, f: 0.25 },
            sets: 5, reps: '6–10', rest: '90 сек', note: 'Прогресія ваги щотижня',
            portionScale: { protein: 1.0, carb: 1.15, fat: 0.95, veggie: 1.0 } },
  recomp: { label: 'Рельєф', icon: '⚡', calAdjust: -200, macros: { p: 0.40, c: 0.30, f: 0.30 },
            sets: 4, reps: '10–12', rest: '75 сек', note: 'Суперсети для щільності',
            portionScale: { protein: 1.15, carb: 0.80, fat: 1.0, veggie: 1.2 } },
};

const DEFAULT_PROFILE = {
  currentWeight: 90,
  targetWeight:  82,
  height:        180,
  age:           30,
  sex:           'male',
  activity:      'moderate',
  goal:          'cut',
  notifyEnabled: false,
  notifyTime:    '18:00',
};
