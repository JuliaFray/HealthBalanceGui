import React, { Dispatch, FC, SetStateAction } from 'react';

import { PlusIcon, TrashIcon } from '@phosphor-icons/react';

import { ActionIcon, Box, Group, Input, Select, Table } from '@mantine/core';

import { useRemoveFoodFromDietPlanMutation } from 'shared/api';
import { dayOptions } from 'shared/constants';
import { ICompositionRow, IDietPlan, IPortion } from 'shared/types';

import { DietStats } from './diet-stats.ui';

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
  };
};

interface Props {
  currentDay: number;
  setCurrentDay: (newDay: string) => void;
  diet: IDietPlan;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  portions: IPortion[];
  rating: number;
}

export const DietConsistList: FC<Props> = ({
  currentDay,
  setCurrentDay,
  diet,
  setOpenDialog,
  portions,
  rating,
}) => {
  const getSummaryWeight = (p: IPortion) => {
    return p.portion.reduce((acc, current) => acc + current.weightG, 0) ?? 0;
  };

  const listRows =
    portions?.map((portion) => createListData(portion, getSummaryWeight(portion))) || [];

  const [removeFood] = useRemoveFoodFromDietPlanMutation();

  const handleRemoveFood = (foodId: string) => {
    removeFood({ id: diet._id, foodId, day: currentDay });
  };

  return (
    <Box pt={10}>
      <Group justify='space-between'>
        <Input.Wrapper style={{ height: '80px', width: '70%' }} label='День плана'>
          <Select
            value={currentDay?.toString()}
            data={dayOptions.slice(0, diet.period)}
            onChange={(e) => (e ? setCurrentDay(e) : null)}
          />
        </Input.Wrapper>

        <ActionIcon variant='light' onClick={() => setOpenDialog(true)}>
          <PlusIcon size={24} weight='light' />
        </ActionIcon>
      </Group>

      <Table.ScrollContainer minWidth={500}>
        <Table verticalSpacing='sm' highlightOnHover>
          <Table.Thead>
            <Table.Tr key='header'>
              <Table.Th style={{ width: '5%' }} />
              <Table.Th style={{ width: '40%' }} />
              <Table.Th>Объем (г)</Table.Th>
              <Table.Th>ккал</Table.Th>
              <Table.Th>Белки (г)</Table.Th>
              <Table.Th>Жиры (г)</Table.Th>
              <Table.Th>Углев. (г)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {listRows.map((row) => (
              <Table.Tr key={row.name}>
                <Table.Td style={{ padding: 0 }}>
                  <ActionIcon
                    variant='transparent'
                    onClick={() => handleRemoveFood(row._id)}
                    color='red'
                  >
                    <TrashIcon size={24} weight='light' />
                  </ActionIcon>
                </Table.Td>
                <Table.Td component='th' scope='row'>
                  {row.name}
                </Table.Td>
                <Table.Td align='right'>{row.weight}</Table.Td>
                <Table.Td align='right'>{row.calories.toFixed(2)}</Table.Td>
                <Table.Td align='right'>{row.protein.toFixed(2)}</Table.Td>
                <Table.Td align='right'>{row.fat.toFixed(2)}</Table.Td>
                <Table.Td align='right'>{row.carbs.toFixed(2)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <DietStats
        plan={diet.userId.config.targets.targetStat}
        portions={portions}
        currentDay={currentDay}
        rating={rating}
      />
    </Box>
  );
};
