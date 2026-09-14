export const WEEK_DAY = ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'];

export const MONTHS =
  'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь';

export const today = new Date();

export const TODAY = {
  year: today.getFullYear(),
  month: today.getMonth(),
  date: today.getDate(),
  dayNumber: today.getDay(),
  dayName: WEEK_DAY[today.getDay()],
};
