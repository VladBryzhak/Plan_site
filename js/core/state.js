/* =====================
   core/state.js — глобальний стан додатку
   Єдине джерело правди для всіх модулів
   ===================== */

export const state = {
  activeDay:      0,
  openAccordion:  null,   /* { day, ex } або null */
  profile:        null,
  pendingChanges: false,
  tempGoal:       null,   /* тимчасовий вибір в модалці налаштувань */
};
