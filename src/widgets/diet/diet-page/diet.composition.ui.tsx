import React, { FC, useEffect, useState } from 'react';

import { round } from 'lodash';

import { Container, Tabs } from '@mantine/core';

import { useAddFoodToDietPlanMutation } from 'shared/api';
import { useQueryParams, useSetTabToQuery } from 'shared/hook';
import { IDietPlan, IPortion, Nullable, Nutrients } from 'shared/types';
import { a11yProps } from 'shared/utils';

import { AddFood } from './add-food.ui';
import { DietConsistFood } from './diet-composition-food.ui';
import { DietConsistList } from './diet-composition-list.ui';

interface Props {
  diet: IDietPlan;
}

// eslint-disable-next-line no-shadow
export enum DIET_COMPOSITION_TABS {
  DIET_COMPOSITION_FOOD = 'food',
  DIET_COMPOSITION_LIST = 'list',
}

const MULT_COEF = 5 / 4;

const calcRating = (plan: Nutrients, fact: Nutrients) => {
  return round(
    5 -
      ((MULT_COEF * Math.abs(plan.calories - fact.calories)) / plan.calories +
        (MULT_COEF * Math.abs(plan.proteins - fact.proteins)) / plan.proteins +
        (MULT_COEF * Math.abs(plan.carbs - fact.carbs)) / plan.carbs +
        (MULT_COEF * Math.abs(plan.fats - fact.fats)) / plan.fats),
    2,
  );
};

export const DietPlanComposition: FC<Props> = ({ diet }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState<string>(DIET_COMPOSITION_TABS.DIET_COMPOSITION_FOOD);

  const [currentDay, setCurrentDay] = useState<number>(1);

  const { queryParams, setQueryParams } = useQueryParams();

  const handleTabChange = (newValue: Nullable<string>) => {
    if (newValue) {
      setTabIndex(newValue);
      setQueryParams({ ...queryParams, view: newValue });
    }
  };

  const handleDayChange = (newValue: Nullable<string>) => {
    if (newValue) {
      setCurrentDay(Number(newValue));
      setQueryParams({ ...queryParams, day: newValue });
    }
  };

  useSetTabToQuery([
    {
      setter: setTabIndex,
      queryParams: queryParams.view as string,
      additional: DIET_COMPOSITION_TABS.DIET_COMPOSITION_FOOD,
    },
    {
      setter: setCurrentDay,
      queryParams: queryParams.day as number,
      additional: 1,
    },
  ]);

  useEffect(() => {
    setCurrentDay(queryParams.day as number);
  }, []);

  const { planByDay } = diet;
  const portions = planByDay?.find((food) => food.day === Number(currentDay))?.portions || [];

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
        proteinsG: acc.proteins + current.proteins,
        fats: acc.fats + current.fats,
        fatsG: acc.fats + current.fats,
        carbs: acc.carbs + current.carbs,
        carbsG: acc.carbs + current.carbs,
        calories: acc.calories + current.calories,
      }),
      {
        proteins: 0,
        proteinsG: 0,
        fats: 0,
        fatsG: 0,
        carbs: 0,
        carbsG: 0,
        calories: 0,
      },
    );

  const rating = calcRating(diet.userId.config.targets.targetStat, fact);

  const [addFood] = useAddFoodToDietPlanMutation();

  return (
    <Container p={0}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tabs.List grow>
          <Tabs.Tab {...a11yProps(DIET_COMPOSITION_TABS.DIET_COMPOSITION_FOOD)}>
            Приемы пищи
          </Tabs.Tab>
          <Tabs.Tab {...a11yProps(DIET_COMPOSITION_TABS.DIET_COMPOSITION_LIST)}>Нутриенты</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={DIET_COMPOSITION_TABS.DIET_COMPOSITION_FOOD}>
          <DietConsistFood
            diet={diet}
            currentDay={currentDay}
            setCurrentDay={handleDayChange}
            setOpenDialog={setOpenDialog}
            portions={portions}
            rating={rating}
          />
        </Tabs.Panel>

        <Tabs.Panel value={DIET_COMPOSITION_TABS.DIET_COMPOSITION_LIST}>
          <DietConsistList
            currentDay={currentDay}
            setCurrentDay={handleDayChange}
            diet={diet}
            setOpenDialog={setOpenDialog}
            portions={portions}
            rating={rating}
          />
        </Tabs.Panel>
      </Tabs>

      <AddFood
        openDrawer={openDialog}
        setOpenDrawer={setOpenDialog}
        day={currentDay}
        meals={diet.meals}
        addFood={addFood}
        isDiary={false}
      />
    </Container>
  );
};
