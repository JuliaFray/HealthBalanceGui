import React, { useEffect, useMemo, useState } from 'react';

import { isEmpty } from 'lodash';

import { Grid, LoadingOverlay, Paper, SimpleGrid } from '@mantine/core';

import { DiaryBlock } from 'widgets/diary';
import { AddFood } from 'widgets/diet';
import { calculateStats } from 'widgets/diet/diet-card/diet-card.utils';
import { StatsRing } from 'widgets/diet/stats-ring';

import {
  useAddFoodToDiaryMutation,
  useGetDayStatQuery,
  useGetFilledDatesQuery,
  useLazyGetDiaryByDayQuery,
} from 'shared/api';
import { useAuth } from 'shared/context';
import { useMedia } from 'shared/hook';
import { ICompositionRow, IPortion, Meal, MealsOptions } from 'shared/types';
import { today, WeekCalendar } from 'shared/ui';

const createListData = (portion: IPortion, summaryWeight: number): ICompositionRow => {
  const {
    foodId: { _id, name, nutrients },
  } = portion;

  const { calories, proteins, carbs, fats } = nutrients || {};

  const mult = summaryWeight / 100;

  return {
    _id,
    name,
    weight: summaryWeight,
    calories: calories * mult,
    fat: fats * mult,
    carbs: carbs * mult,
    protein: proteins * mult,
    meal: portion.portion[0].meal,
  };
};

export const DietDiaryPage = () => {
  const { me } = useAuth();
  const { mdMain, mdSide } = useMedia();

  const [openDialog, setOpenDialog] = useState(false);
  const [date, setDate] = useState<string>(today.toDateString());
  const [selectedMeal, setSelectedMeal] = useState<MealsOptions>('Breakfast');
  const [getDiaryData, { data, isLoading }] = useLazyGetDiaryByDayQuery();
  const { data: filledDates } = useGetFilledDatesQuery();
  const { data: dayStats } = useGetDayStatQuery({ date: new Date(date).toDateString() });

  useEffect(() => {
    getDiaryData({ date: new Date(date).toDateString() });
  }, [date, getDiaryData]);

  const handleAddFood = (meal: MealsOptions) => {
    setOpenDialog(true);
    setSelectedMeal(meal);
  };

  const handleChangeDate = (val: string) => {
    setDate(val);
  };

  const [addFood] = useAddFoodToDiaryMutation();

  const getSummaryWeight = (p: IPortion) => {
    return p.portion?.reduce((acc, current) => acc + current.weightG, 0) ?? 0;
  };

  const listRows = useMemo(() => {
    const mapped =
      data?.data?.portions?.map((portion) => createListData(portion, getSummaryWeight(portion))) ||
      [];
    return {
      breakfast: mapped.filter((r) => r.meal === 'Breakfast'),
      morningSnack: mapped.filter((r) => r.meal === 'MorningSnack'),
      lunch: mapped.filter((r) => r.meal === 'Lunch'),
      afterNoonSnack: mapped.filter((r) => r.meal === 'AfterNoonSnack'),
      dinner: mapped.filter((r) => r.meal === 'Dinner'),
      eveningSnack: mapped.filter((r) => r.meal === 'EveningSnack'),
    };
  }, [data]);

  const statData = calculateStats(me?.config?.targets.targetStat, dayStats?.data);

  return (
    <Grid>
      <Grid.Col span={mdMain} style={{ position: 'relative' }}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'teal', type: 'bars' }}
        />

        {!mdSide && (
          <Paper p={10} style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <WeekCalendar
              day={date}
              onDayChange={handleChangeDate}
              filledDates={filledDates?.data || []}
            />
          </Paper>
        )}

        <DiaryBlock
          mealTitle={Meal.Breakfast}
          handleAddFood={() => handleAddFood('Breakfast')}
          listRows={listRows.breakfast}
          currentDay={date}
        />

        <DiaryBlock
          mealTitle={Meal.MorningSnack}
          handleAddFood={() => handleAddFood('MorningSnack')}
          listRows={listRows.morningSnack}
          currentDay={date}
        />

        <DiaryBlock
          mealTitle={Meal.Lunch}
          handleAddFood={() => handleAddFood('Lunch')}
          listRows={listRows.lunch}
          currentDay={date}
        />

        <DiaryBlock
          mealTitle={Meal.AfterNoonSnack}
          handleAddFood={() => handleAddFood('AfterNoonSnack')}
          listRows={listRows.afterNoonSnack}
          currentDay={date}
        />

        <DiaryBlock
          mealTitle={Meal.Dinner}
          handleAddFood={() => handleAddFood('Dinner')}
          listRows={listRows.dinner}
          currentDay={date}
        />

        <DiaryBlock
          mealTitle={Meal.EveningSnack}
          handleAddFood={() => handleAddFood('EveningSnack')}
          listRows={listRows.eveningSnack}
          currentDay={date}
        />

        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          {statData.map((it) => {
            if (!isEmpty(it.stat)) {
              return (
                <StatsRing
                  label={it.label}
                  stat={it.stat}
                  progress={it.progress}
                  color={it.color}
                  icon={it.icon}
                />
              );
            }
            return null;
          })}
        </SimpleGrid>

        <AddFood
          openDrawer={openDialog}
          setOpenDrawer={setOpenDialog}
          date={date}
          meals={[selectedMeal || 'Breakfast']}
          setSelectedMeal={setSelectedMeal}
          addFood={addFood}
          isDiary
        />
      </Grid.Col>
      {!!mdSide && (
        <Grid.Col span={mdSide}>
          <Paper p={10} style={{ display: 'flex', justifyContent: 'center' }}>
            <WeekCalendar
              isFull
              day={date}
              onDayChange={handleChangeDate}
              filledDates={filledDates?.data || []}
            />
          </Paper>
        </Grid.Col>
      )}
    </Grid>
  );
};
