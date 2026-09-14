import { Meal, TChipData } from '../types';

export const dayOptions: TChipData[] = [
  { _id: '1', value: '1', label: 'День 1' },
  { _id: '2', value: '2', label: 'День 2' },
  { _id: '3', value: '3', label: 'День 3' },
  { _id: '4', value: '4', label: 'День 4' },
  { _id: '5', value: '5', label: 'День 5' },
  { _id: '6', value: '6', label: 'День 6' },
  { _id: '7', value: '7', label: 'День 7' },
];
export const mealsOptions: TChipData[] = [
  { _id: 'Breakfast', value: 'Breakfast', label: Meal.Breakfast },
  { _id: 'MorningSnack', value: 'MorningSnack', label: Meal.MorningSnack },
  { _id: 'Lunch', value: 'Lunch', label: Meal.Lunch },
  { _id: 'AfterNoonSnack', value: 'AfterNoonSnack', label: Meal.AfterNoonSnack },
  { _id: 'Dinner', value: 'Dinner', label: Meal.Dinner },
  { _id: 'EveningSnack', value: 'EveningSnack', label: Meal.EveningSnack },
];
