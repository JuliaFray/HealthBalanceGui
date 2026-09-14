import { MealsOptions } from './diet.type';

export type Unit = 'g' | 'kcal' | 'kJ';

export interface ICompositionRow {
  _id: string;
  name: string;
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  meal?: MealsOptions;
}

export interface Nutrients {
  calories: number;
  proteins: number;
  proteinsG: number;
  carbs: number;
  carbsG: number;
  fats: number;
  fatsG: number;
  otherNutrients?: {
    calcium: number;
    calcium_100g: number;
    calcium_unit: Unit;
    calcium_value: number;

    carbohydrates: number;
    carbohydrates_100g: number;
    carbohydrates_unit: Unit;
    carbohydrates_value: number;
    energy: number;
    'energy-kcal': number;
    'energy-kcal_100g': number;
    'energy-kcal_unit': Unit;
    'energy-kcal_value': number;
    'energy-kcal_value_computed': number;
    'energy-kj': number;
    'energy-kj_100g': number;
    'energy-kj_unit': Unit;
    'energy-kj_value': number;
    'energy-kj_value_computed': number;
    energy_100g: number;
    energy_unit: Unit;
    energy_value: number;
    fat: number;
    fat_100g: number;
    fat_unit: Unit;
    fat_value: number;
    'fruits-vegetables-legumes-estimate-from-ingredients_100g': number;
    'fruits-vegetables-legumes-estimate-from-ingredients_serving': number;
    'fruits-vegetables-nuts-estimate-from-ingredients_100g': number;
    'fruits-vegetables-nuts-estimate-from-ingredients_serving': number;
    'nova-group': number;
    'nova-group_100g': number;
    'nova-group_serving': number;
    proteins: number;
    proteins_100g: number;
    proteins_unit: Unit;
    proteins_value: number;
    salt: number;
    salt_100g: number;
    salt_unit: Unit;
    salt_value: number;
    sodium: number;
    sodium_100g: number;
    sodium_unit: Unit;
    sodium_value: number;
    'trans-fat': number;
    'trans-fat_100g': number;
    'trans-fat_unit': Unit;
    'trans-fat_value': number;
    'vitamin-b2': number;
    'vitamin-b2_100g': number;
    'vitamin-b2_unit': Unit;
    'vitamin-b2_value': number;
  };
}

export interface ProductItem {
  _id: string;
  id: string;
  name: string;
  brand?: string;
  nutrients: Nutrients;
}

export interface AddFoodType {
  id?: string;
  day?: number;
  date?: string;
  foods: {
    id: string;
    meals: {
      meal: MealsOptions;
      weightG: number;
    }[];
  }[];
}
