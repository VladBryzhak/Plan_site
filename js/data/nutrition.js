/* =====================
   data/nutrition.js — план харчування тижень 1 і 2
   ===================== */

export const WEEK1 = [
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

export const WEEK2 = [
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