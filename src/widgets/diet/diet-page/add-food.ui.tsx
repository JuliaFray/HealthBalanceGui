import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useParams } from 'react-router-dom';

import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useAddFoodToDiaryMutation, useLazyGetFoodListQuery } from 'shared/api';
import { mealsOptions } from 'shared/constants';
import { MealsOptions, ProductItem } from 'shared/types';
import { CustomPagination } from 'shared/ui';

type AddFoodTrigger = ReturnType<typeof useAddFoodToDiaryMutation>[0];

interface Props {
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
  day?: number;
  date?: string;
  meals: MealsOptions[];
  setSelectedMeal?: Dispatch<SetStateAction<MealsOptions>>;
  addFood: AddFoodTrigger;
  isDiary: boolean;
}

export const AddFood: FC<Props> = ({
  openDrawer,
  setOpenDrawer,
  day,
  meals,
  setSelectedMeal,
  addFood,
  date,
  isDiary,
}) => {
  const { id } = useParams();

  const [openedModal, { toggle: toggleModal, close: closeModal }] = useDisclosure(false);
  const [portion, setPortion] = useState<string>('');
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState<ProductItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [getFoods, { data, isLoading }] = useLazyGetFoodListQuery();

  const foods: ProductItem[] = useMemo(
    () => data?.data?.filter((row) => !!row.nutrients && !!Object.keys(row.nutrients).length) || [],
    [data?.data],
  );

  useEffect(() => {
    if (search) {
      getFoods({ query: search, page: currentPage }, false);
    }
  }, [currentPage, getFoods]);

  const handleSearch = () => {
    getFoods({ query: search, page: currentPage });
  };

  const handleClose = () => {
    setOpenDrawer(false);
    setSearch('');
    closeModal();
    setPortion('');
  };

  const handleAdd = () => {
    let body;
    if (isDiary) {
      body = {
        date,
        foods: foods
          .filter((f) => selectedFood.includes(f))
          .map((it) => ({
            id: it.id,
            meals: [{ meal: meals[0], weightG: Number(portion) }],
          })),
      };
    } else {
      body = {
        id: id!,
        day,
        foods: foods
          .filter((f) => selectedFood.includes(f))
          .map((it) => ({
            id: it.id,
            meals,
          })),
      };
    }
    addFood(body);
    handleClose();
  };

  const handleToggle = (value: ProductItem) => {
    const currentIndex = selectedFood.indexOf(value);
    const newChecked = [...selectedFood];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectedFood(newChecked);
  };

  const concatNutrients = (food: ProductItem) => {
    return `К: ${food.nutrients.calories}, Б: ${food.nutrients.proteins}, Ж: ${
      food.nutrients.fats
    }, У: ${food.nutrients.carbs}`;
  };

  const onSelectForDiary = (food: ProductItem) => {
    toggleModal();
    setSelectedFood([food]);
  };

  return (
    <Drawer
      offset={8}
      radius='md'
      opened={openDrawer}
      onClose={handleClose}
      title={<Text>Добавить продукт{isDiary ? '' : 'ы'}</Text>}
      position='right'
      styles={{
        content: { position: 'relative', top: '64px', height: 'calc(100vh - 84px)' },
      }}
    >
      <Stack style={{ height: '100%', position: 'relative' }}>
        <Group wrap='nowrap' style={{ width: '100%' }}>
          <Input.Wrapper style={{ height: '65px', width: '100%' }} label='Введите название'>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} />
          </Input.Wrapper>

          <ActionIcon variant='transparent' onClick={handleSearch} color='teal'>
            <MagnifyingGlassIcon size={24} weight='light' />
          </ActionIcon>
        </Group>

        <ScrollArea
          h={`calc(80vh - ${isDiary ? '110' : '160'}px)`}
          offsetScrollbars
          style={{ position: 'relative' }}
        >
          <LoadingOverlay
            visible={isLoading}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: 'teal', type: 'bars' }}
          />
          {foods.map((f) => {
            const diaryStack = (
              <Stack onClick={() => onSelectForDiary(f)} style={{ cursor: 'pointer' }}>
                <Group wrap='nowrap'>
                  <Stack key={f.id}>
                    <Text>{f.name}</Text>
                    <Text c='dimmed' size='sm'>
                      {concatNutrients(f)}
                    </Text>
                  </Stack>
                </Group>
                <Divider />
              </Stack>
            );

            const dietPlanStack = (
              <Stack>
                <Group wrap='nowrap'>
                  <Checkbox checked={selectedFood.includes(f)} onChange={() => handleToggle(f)} />
                  <Stack key={f.id}>
                    <Text>{f.name}</Text>
                    <Text c='dimmed' size='sm'>
                      {concatNutrients(f)}
                    </Text>
                  </Stack>
                </Group>
                <Divider />
              </Stack>
            );

            return isDiary ? diaryStack : dietPlanStack;
          })}
        </ScrollArea>

        <Stack style={{ position: 'fixed', bottom: '0px' }} gap={4}>
          <CustomPagination
            page={currentPage}
            dataLength={data?.totalCount ?? 0}
            setCurrentPage={setCurrentPage}
          />

          {!isDiary && (
            <Group mb={10} style={{ alignSelf: 'end' }}>
              <Button variant='default' onClick={handleClose}>
                Отмена
              </Button>
              <Button
                variant='filled'
                type='button'
                disabled={!selectedFood.length}
                onClick={handleAdd}
              >
                Добавить
              </Button>
            </Group>
          )}
        </Stack>
      </Stack>

      <Modal
        zIndex={450}
        opened={openedModal}
        onClose={closeModal}
        centered
        title='Добавление продукта'
      >
        <Card withBorder padding='sm' radius='md'>
          <Input.Wrapper style={{ height: '65px', width: '100%' }} label='Прием пищи'>
            <Select
              value={meals[0]}
              onChange={(e) => (e ? setSelectedMeal?.(e as MealsOptions) : null)}
              data={mealsOptions}
            />
          </Input.Wrapper>

          <Input.Wrapper style={{ height: '65px', width: '100%' }} label='Количество (г)'>
            <Input value={portion} onChange={(e) => setPortion(e.target.value)} />
          </Input.Wrapper>

          <Button
            variant='filled'
            type='button'
            disabled={!selectedFood.length}
            onClick={handleAdd}
          >
            Добавить
          </Button>
        </Card>
      </Modal>
    </Drawer>
  );
};
