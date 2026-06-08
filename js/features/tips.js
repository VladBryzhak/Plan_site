/* =====================
   features/tips.js — адаптивна вкладка порад
   Весь контент генерується динамічно з профілю користувача.
   ===================== */

import { state }                     from '../core/state.js';
import { calcTargetCal, calcMacros } from '../core/calc.js';
import { GOALS }                     from '../data/profile.js';

/* ---- ІМТ ---- */
function calcBMI(p) {
  const h = p.height / 100;
  return p.currentWeight / (h * h);
}

function bmiLabel(bmi) {
  if (bmi < 16)   return { text: 'Виражений дефіцит', cls: 'bmi-alert' };
  if (bmi < 18.5) return { text: 'Нижче норми',       cls: 'bmi-low'   };
  if (bmi < 25)   return { text: 'Норма',              cls: 'bmi-ok'    };
  if (bmi < 30)   return { text: 'Надмірна вага',      cls: 'bmi-warn'  };
  return                  { text: 'Ожиріння',           cls: 'bmi-alert' };
}

/* ---- Рекомендований білок г/кг ---- */
function proteinPerKg(goal) {
  return goal === 'bulk' ? 1.8 : 2.0;
}

/* ---- Рядок поради ---- */
function tip(icon, html) {
  return `<div class="tip-row"><span class="tip-icon">${icon}</span><span>${html}</span></div>`;
}

/* ---- Розділювач всередині картки ---- */
function divider(label) {
  return `<div class="tips-divider-label">${label}</div>`;
}

/* ==================================================
   КАРТКА 1 — Персональне зведення
   ================================================== */
function renderSummaryCard(p, cal, m) {
  const bmi    = calcBMI(p);
  const bmiInf = bmiLabel(bmi);
  const protRec = Math.round(p.currentWeight * proteinPerKg(p.goal));
  const goal   = GOALS[p.goal];

  const diff = +(p.currentWeight - p.targetWeight).toFixed(1);
  const diffText = diff > 0
    ? `−${diff} кг до цілі`
    : diff < 0
    ? `+${Math.abs(diff)} кг до цілі`
    : '✓ Ціль досягнута';

  /* Прогрес-бар: чим ближче до цілі, тим довший */
  const initialDiff = Math.abs(diff);
  const pct = diff === 0 ? 100 : Math.min(95, Math.max(5, 100 - (initialDiff / 30) * 100));

  const ACTIVITY_LABELS = {
    sedentary: 'Низька активність',
    moderate:  'Помірна активність',
    active:    'Висока активність',
  };
  const SEX_LABELS = { male: 'Чоловік', female: 'Жінка' };

  return `
  <div class="card tips-summary-card">
    <div class="tips-header-row">
      <span class="tips-section-title">📊 Твій профіль</span>
      <span class="tips-goal-badge">${goal.icon} ${goal.label}</span>
    </div>

    <div class="tips-stats-grid">
      <div class="tips-stat-box">
        <div class="tips-stat-val ${bmiInf.cls}">${bmi.toFixed(1)}</div>
        <div class="tips-stat-lbl">ІМТ · ${bmiInf.text}</div>
      </div>
      <div class="tips-stat-box">
        <div class="tips-stat-val">${cal}</div>
        <div class="tips-stat-lbl">ккал · денна норма</div>
      </div>
      <div class="tips-stat-box">
        <div class="tips-stat-val">${m.protein}г</div>
        <div class="tips-stat-lbl">білок за планом</div>
      </div>
      <div class="tips-stat-box">
        <div class="tips-stat-val ${protRec > m.protein ? 'bmi-warn' : 'bmi-ok'}">${protRec}г</div>
        <div class="tips-stat-lbl">білок рекомендований${protRec > m.protein ? ' ↑' : ' ✓'}</div>
      </div>
    </div>

    <div class="tips-macros-row">
      <div class="tips-macro-pill" style="--mc:#4CAF50">Б ${m.protein}г</div>
      <div class="tips-macro-pill" style="--mc:#2196F3">В ${m.carbs}г</div>
      <div class="tips-macro-pill" style="--mc:#FF9800">Ж ${m.fat}г</div>
    </div>

    <div class="tips-progress">
      <div class="tips-progress-labels">
        <span>${p.currentWeight} кг</span>
        <span class="tips-progress-mid">${diffText}</span>
        <span>${p.targetWeight} кг</span>
      </div>
      <div class="tips-progress-track">
        <div class="tips-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>

    <div class="tips-meta-row">
      <span>${SEX_LABELS[p.sex] || '—'}</span>
      <span>${p.age} р.</span>
      <span>${p.height} см</span>
      <span>${ACTIVITY_LABELS[p.activity] || '—'}</span>
    </div>
  </div>`;
}

/* ==================================================
   КАРТКА 2 — Поради під ціль
   ================================================== */
const GOAL_CONTENT = {
  cut: (p, m) => [
    tip('🥩', `Мінімум <strong>${Math.round(p.currentWeight * 1.8)}–${Math.round(p.currentWeight * 2.2)}г</strong> білка на день — зберігає м'язи при дефіциті калорій`),
    tip('📉', 'Дефіцит <strong>300–500 ккал</strong> — оптимальний темп. Більше → втрата мʼязів і сповільнення метаболізму'),
    tip('🚶', 'NEAT критичний: 7000–10000 кроків на день поза тренуваннями дають 200–400 ккал витрат'),
    tip('🥦', 'Овочі та клітковина — їж без обмежень: ситність при мінімумі калорій'),
    tip('📊', 'Зважуйся щоранку натще, але оцінюй тренд за 7–10 днів — денні коливання до 2 кг є нормою'),
    tip('💧', '0.5л холодної води перед їжею зменшує спожиту порцію на 15–20%'),
  ],
  bulk: (p, m) => [
    tip('🍽️', 'Надлишок <strong>250–400 ккал</strong> — «чистий» набір з мінімальним жиром'),
    tip('💪', 'Прогресивне навантаження головне: +вага або +повтори кожні 1–2 тижні — без цього росту немає'),
    tip('🥩', `Розподіли <strong>${m.protein}г білка</strong> на 4–5 прийомів: ~${Math.round(m.protein/5)}г за раз для максимального синтезу`),
    tip('😴', 'Мʼязи ростуть уві сні: 8+ год на фазі набору — не підлягає компромісу'),
    tip('🍌', 'Після тренування — вуглеводи + білок упродовж 2 год для поповнення глікогену'),
    tip('📈', 'Норма: 0.5–1 кг на місяць. Якщо більше — зменш калораж на 100–150 ккал'),
  ],
  recomp: (p, m) => [
    tip('⏳', 'Рекомпозиція повільна: −1–2 кг жиру і +0.5–1 кг мʼязів на місяць — це відмінний результат'),
    tip('🥩', `<strong>${m.protein}г білка</strong> на день — основа. При помірному дефіциті захищає мʼязи і стимулює ріст`),
    tip('⏰', 'Більше вуглеводів у дні тренувань, менше — у дні відпочинку (більше білка)'),
    tip('📏', 'Вага може стояти місяцями при рекомпу — вимірюй обсяги тіла (талія, стегна, груди)'),
    tip('💧', 'Вода прискорює метаболізм і зменшує затримку рідини — мінімум 2.5–3л'),
    tip('🔄', 'Силове + кардіо — обовʼязкова комбінація. Без кардіо рекомп значно повільніший'),
  ],
};

function renderGoalCard(p, m) {
  const goal = GOALS[p.goal];
  const fns  = GOAL_CONTENT[p.goal] || GOAL_CONTENT.recomp;
  return `
  <div class="card">
    <h2 class="tip-section-title">${goal.icon} Під твою ціль — «${goal.label}»</h2>
    ${fns(p, m).join('')}
  </div>`;
}

/* ==================================================
   КАРТКА 3 — Тренування + активність
   ================================================== */
const ACTIVITY_TIPS = {
  sedentary: [
    tip('🚶', 'Починай поступово: 20 хв прогулянки щодня — вже великий крок для нетренованого тіла'),
    tip('🪑', 'Сидяча робота: вставай кожну годину на 5 хв — знижує ризики і прискорює метаболізм'),
    tip('📱', 'Автоматизуй: поклади нагадування про воду і рух — на початку вся дисципліна потрібна'),
  ],
  moderate: [
    tip('📈', 'Збільшуй тренувальний обʼєм поступово: +5–10% навантаження кожні 2 тижні'),
    tip('🔄', 'Легкий тиждень (deload) кожні 4–6 тижнів — відновлює ЦНС і дає кращий довготривалий прогрес'),
  ],
  active: [
    tip('🔄', 'При 5+ тренуваннях на тиждень активне відновлення так само важливе, як самі тренування'),
    tip('🧘', '1 день повного відпочинку або мобільності на тиждень — підвищує прогрес, а не гальмує'),
    tip('🩸', 'Залізо і вітамін D виснажуються першими при інтенсивному тренінгу — перевір аналізами'),
  ],
};

function renderTrainingCard(p) {
  const setsLabel = p.goal === 'bulk'
    ? '4–6 повторень, відпочинок 3+ хв — максимальна силова адаптація'
    : p.goal === 'cut'
    ? '12–20 повторень, коротший відпочинок — вищий метаболічний ефект при дефіциті'
    : '8–12 повторень, відпочинок 90 с — золотий стандарт гіпертрофії';

  return `
  <div class="card">
    <h2 class="tip-section-title">🏋 Тренування</h2>
    ${tip('⏱', 'Розминка 5–7 хв — обовʼязково. Знижує ризик травм і підвищує якість роботи')}
    ${tip('📐', setsLabel)}
    ${tip('📈', 'Кожні 1–2 тижні — більша вага або більше повторень. Без прогресії немає росту')}
    ${tip('🏃', 'Пробіжки у розмовному темпі (65% ЧСС макс) — жир горить, мʼяз не руйнується')}
    ${tip('🤸', 'Розтяжка 5–10 хв після тренування — зменшує крепатуру і покращує поставу')}
    ${divider(`Під твій рівень активності`)}
    ${(ACTIVITY_TIPS[p.activity] || ACTIVITY_TIPS.moderate).join('')}
  </div>`;
}

/* ==================================================
   КАРТКА 4 — Харчування
   ================================================== */
function renderNutritionCard(p, m) {
  const protRec  = Math.round(p.currentWeight * proteinPerKg(p.goal));
  const perMeal  = Math.round(protRec / 5);
  const cutFocus = p.goal === 'cut';
  const bulkFocus = p.goal === 'bulk';

  return `
  <div class="card">
    <h2 class="tip-section-title">🥗 Харчування</h2>
    ${tip('🥩', `Твоя норма білка — <strong>${protRec}г/день</strong>. Розбий на 4–5 прийомів по ~${perMeal}г`)}
    ${tip('💧', 'Вода 2.5–3л на день. Ознака норми — світло-жовта сеча протягом дня')}
    ${tip('🕐', 'Їж кожні 3–4 год: підтримує рівень енергії та синтез білка протягом доби')}
    ${cutFocus
      ? tip('🥦', 'Починай кожен прийом з овочів і білка — знижує загальне споживання калорій автоматично')
      : tip('🍚', `Вуглеводи до і після тренування — паливо та відновлення. Орієнтир: ~${Math.round(m.carbs * 0.4)}г до + ~${Math.round(m.carbs * 0.4)}г після`)}
    ${bulkFocus
      ? tip('🌙', 'Протеїновий прийом їжі перед сном (казеїн / кефір / яйця) — живить м`язи 6–8 год ночі')
      : tip('🚫', 'Уникай «рідких калорій»: сік, алкоголь, солодкі напої — пусті ккал без ситості')}
    ${tip('⚖️', 'Зважуйся раз на тиждень вранці натще — щоденні коливання вводять в оману')}
  </div>`;
}

/* ==================================================
   КАРТКА 5 — Відновлення (вік + стать)
   ================================================== */
function getAgeTips(age) {
  if (age < 25) return [
    tip('⚡', 'Твій вік — перевага: швидке відновлення. Закладай базу техніки зараз — вона служить десятиліттями'),
    tip('📚', 'Нервова система адаптується швидко — не бійся додавати нові вправи та техніки'),
  ];
  if (age < 40) return [
    tip('⚖️', 'Баланс між інтенсивністю і відновленням важливіший, ніж у 20 — слухай тіло'),
    tip('💤', 'Якість сну прямо впливає на рівень тестостерону і кортизолу — пріоритизуй режим'),
  ];
  return [
    tip('🦴', 'Після 40 — розминка мінімум 10–12 хв і розтяжка після кожного тренування є нормою'),
    tip('💊', 'Вітамін D і магній критичні після 40 — перевір рівні аналізами раз на рік'),
    tip('⏱️', 'Відпочинок між підходами 2–3 хв замість 60 с — суглобам і ЦНС потрібно більше часу'),
  ];
}

function getSexTips(sex) {
  if (sex === 'female') return [
    tip('🔄', 'Фолікулярна фаза (1–14 дні циклу) — найвища силова здатність. Робота важчих підходів у цей час'),
    tip('🥛', 'Жінки потребують більше кальцію (1000–1200 мг/день) — молочні продукти або добавки'),
    tip('🩸', 'Залізо важливе: червоне мʼясо, шпинат або добавки — особливо при інтенсивному тренінгу'),
  ];
  return [
    tip('🌅', 'Тестостерон максимальний вранці — силові тренування ранком дають кращий анаболічний відгук'),
    tip('🧴', 'Цинк (15 мг) і магній (400 мг) підтримують рівень тестостерону при інтенсивному тренінгу'),
    tip('😴', 'Кортизол (гормон стресу) руйнує мʼяз — хронічний недосип = антагоніст прогресу'),
  ];
}

function renderRecoveryCard(p) {
  const ageTips = getAgeTips(p.age);
  const sexTips = getSexTips(p.sex);
  const sexLabel = p.sex === 'female' ? 'Особливості для жінок' : 'Особливості для чоловіків';

  return `
  <div class="card">
    <h2 class="tip-section-title">❤️ Відновлення</h2>
    ${tip('😴', 'Сон 7–8 год — найважливіший фактор прогресу. Уві сні виділяється гормон росту')}
    ${tip('🚶', 'Мʼязовий біль? Легка прогулянка 20–30 хв відновлює краще, ніж повне лежання')}
    ${tip('🛁', 'Холодний душ або контрастний — зменшує запалення і крепатуру після важкого тренування')}
    ${tip('❗', 'Різкий біль у суглобах під час вправи — зупинись. Крепатура ≠ біль у суглобах')}
    ${divider(`Під твій вік · ${p.age} р.`)}
    ${ageTips.join('')}
    ${divider(sexLabel)}
    ${sexTips.join('')}
  </div>`;
}

/* ==================================================
   ГОЛОВНИЙ РЕНДЕР
   ================================================== */
export function renderTips() {
  const container = document.getElementById('tips-content');
  if (!container) return;
  const p   = state.profile;
  const cal = calcTargetCal(p);
  const m   = calcMacros(p);
  container.innerHTML = [
    renderSummaryCard(p, cal, m),
    renderGoalCard(p, m),
    renderTrainingCard(p),
    renderNutritionCard(p, m),
    renderRecoveryCard(p),
  ].join('');
}