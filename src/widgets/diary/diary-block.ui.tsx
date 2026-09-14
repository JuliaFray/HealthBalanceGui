import React, { FC } from 'react';

import { PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { isEmpty } from 'lodash';

import { ActionIcon, Box, Button, Container, Group, Table, Text, Paper } from '@mantine/core';

import { useRemoveDiaryRecordMutation, useRemoveFoodFromDietPlanMutation } from 'shared/api';
import { ICompositionRow, Meal } from 'shared/types';

interface Props {
  mealTitle: Meal;
  handleAddFood: () => void;
  listRows: ICompositionRow[];
  currentDay: string;
}

export const DiaryBlock: FC<Props> = ({ mealTitle, handleAddFood, listRows, currentDay }) => {
  const [removeFood] = useRemoveDiaryRecordMutation();

  const handleRemoveFood = (foodId: string) => {
    removeFood({ foodId, day: currentDay });
  };

  return (
    <Paper p={10} mb={10}>
      <Box>
        <Container>
          <Group style={{ justifyContent: 'space-between' }}>
            <Text size='md'>{mealTitle}</Text>
            <Button
              type='button'
              size='sm'
              variant='transparent'
              onClick={handleAddFood}
              leftSection={<PlusIcon size={16} weight='light' />}
            >
              Добавить продукт
            </Button>
          </Group>
        </Container>

        {!isEmpty(listRows) && (
          <Table.ScrollContainer minWidth={600}>
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
                  <Table.Tr key={row._id}>
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
        )}
      </Box>
    </Paper>
  );
};
