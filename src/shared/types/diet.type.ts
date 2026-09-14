import { Nullable } from 'shared/types/general.type';

import { Nutrients, ProductItem } from './food.type';
import { IUser, IUserWithTargets } from './profile.type';

/** Приемы пищи */
// eslint-disable-next-line no-shadow
export enum Meal {
  Breakfast = 'Завтрак',
  MorningSnack = 'Утренний перекус',
  Lunch = 'Обед',
  AfterNoonSnack = 'Обеденный перекус',
  Dinner = 'Ужин',
  EveningSnack = 'Вечерний перекус',
}

export type MealsOptions =
  | 'Breakfast'
  | 'MorningSnack'
  | 'Lunch'
  | 'AfterNoonSnack'
  | 'Dinner'
  | 'EveningSnack';

export interface IDietRingStat {
  label: string;
  stat: Nullable<string>;
  progress: number;
  color: string;
  icon?: string;
}

export interface IPortion {
  /** Продукт питания */
  foodId: ProductItem;
  /** Прием пищи и количество */
  portion: { meal: MealsOptions; weightG: number }[];
}

export interface IPlanByDay {
  /** День плана */
  day: number;
  /** Рейтинг каждого дня */
  dayRating: number;
  /** Записи еды */
  portions: IPortion[];
}

/** План питания */
export interface IDietPlan {
  _id: string;
  /** Наименование плана питания */
  name: string;
  /** Количетсво дней */
  period: number;
  /** Создатель */
  userId: IUser;
  /** Приемы пищи в плане */
  meals: MealsOptions[];
  /** Статистика плана питания */
  statResult: Nutrients & {
    /** Рейтинг плана */
    planRating: number;
  };
  /** Список продуктов в плане питания */
  planByDay: IPlanByDay[];
}

export interface IDiaryRecord {
  /** Создатель */
  userId: IUserWithTargets;
  /** Дата */
  day: Date;
  /** Записи еды */
  portions: IPortion[];
}
