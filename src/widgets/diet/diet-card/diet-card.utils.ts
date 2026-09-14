import { IDietRingStat, Nutrients } from 'shared/types';

const statLabel = {
  calories: 'ккал',
  proteins: 'Белки',
  fats: 'Жиры',
  carbs: 'Углеводы',
};

const statColor = {
  calories: 'teal',
  proteins: 'blue',
  fats: 'red',
  carbs: 'violet',
};

export const calculateStats = (target?: Nutrients, fact?: Nutrients): IDietRingStat[] => {
  if (!target || !fact) {
    return Object.keys(statLabel).map((tk) => ({
      label: statLabel[tk],
      stat: '0',
      progress: 0,
      color: statColor[tk],
    }));
  }

  return Object.keys(statLabel).map((tk) => ({
    label: statLabel[tk],
    stat: target[tk]
      ? `${Math.round((fact[tk] * 100) / (target[`${tk}G`] || target[`${tk}`])).toString()} %`
      : null,
    progress: (fact[tk] * 100) / target[tk] || 0,
    color: statColor[tk],
  }));
};
