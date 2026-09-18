import React, { FC, useEffect } from 'react';

import { Grid, Group, Progress, Stack, Text } from '@mantine/core';

import { useAppDispatch } from 'shared/hook';
import { dietActions } from 'shared/model';
import { IPortion, Nutrients } from 'shared/types';
import { StyledRating } from 'shared/ui';

import styles from './diet.module.scss';

const calcPercent = (planValue: number, factValue: number): number => {
  return Math.round((factValue / planValue) * 100);
};

const getColor = (mult: number) => {
  if (mult >= 0.8 && mult < 1) {
    return 'teal';
  }
  if (mult > 1) {
    return 'red';
  }
  return 'yellow';
};

interface Props {
  plan?: Nutrients;
  portions: IPortion[];
  currentDay: number;
  rating: number;
}

export const DietStats: FC<Props> = ({ plan, portions, currentDay, rating }) => {
  if (!plan) {
    return null;
  }
  const dispatch = useAppDispatch();

  const getSummaryWeight = (p: IPortion) => {
    return p.portion.reduce((acc, current) => acc + current.weightG, 0) ?? 0;
  };

  const fact = portions
    .map((p) => {
      const {
        foodId: { nutrients },
      } = p;

      const { calories, proteins, carbs, fats } = nutrients || {};

      const m = getSummaryWeight(p) / 100;

      return {
        calories: m * calories,
        proteins: m * proteins,
        fats: m * fats,
        carbs: m * carbs,
      };
    })
    .reduce(
      (acc, current) => ({
        ...acc,
        proteins: acc.proteins + current.proteins,
        fats: acc.fats + current.fats,
        carbs: acc.carbs + current.carbs,
        calories: acc.calories + current.calories,
      }),
      {
        proteins: 0,
        fats: 0,
        carbs: 0,
        calories: 0,
      },
    );

  useEffect(() => {
    dispatch(dietActions.setDayRating({ dayName: currentDay, rating }));
  }, [currentDay, dispatch, rating]);

  return (
    <Stack style={{ marginTop: '24px' }} className={styles.root}>
      <Grid>
        <Grid.Col span={4}>
          <Text>Каллории</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Group wrap='nowrap'>
            <Progress
              value={calcPercent(plan.calories, fact.calories)}
              color={getColor(fact.calories / plan.calories)}
              className={styles.stat}
            />
            <Text className={styles.percent}>{calcPercent(plan.calories, fact.calories)} %</Text>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Text>Белки</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Group wrap='nowrap'>
            <Progress
              value={calcPercent(plan.proteinsG, fact.proteins)}
              color={getColor(fact.proteins / plan.proteinsG)}
              className={styles.stat}
            />
            <Text className={styles.percent}>{calcPercent(plan.proteinsG, fact.proteins)} %</Text>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Text>Жиры</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Group wrap='nowrap'>
            <Progress
              value={calcPercent(plan.fatsG, fact.fats)}
              color={getColor(fact.fats / plan.fatsG)}
              className={styles.stat}
            />
            <Text className={styles.percent}>{calcPercent(plan.fatsG, fact.fats)} %</Text>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Text>Углеводы</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Group wrap='nowrap'>
            <Progress
              value={calcPercent(plan.carbsG, fact.carbs)}
              color={getColor(fact.carbs / plan.carbsG)}
              className={styles.stat}
            />
            <Text className={styles.percent}>{calcPercent(plan.carbsG, fact.carbs)} %</Text>
          </Group>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Text>Рейтинг</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <StyledRating value={rating} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
