import React, { FC, useState } from 'react';

import { Form, Formik } from 'formik';
import { round } from 'lodash';

import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { useChangeAvatarMutation, useChangeProfileMutation } from 'shared/api';
import { useAuth } from 'shared/context';
import { useAppDispatch } from 'shared/hook';
import { profileActions } from 'shared/model';
import { ActivityLevel, Gender, IUser, IUserWithTargets, Nullable } from 'shared/types';
import { InputWrapper } from 'shared/ui';
import { getAvatarSrc } from 'shared/utils';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Сидячий образ жизни (мало движения)' },
  { value: 'lightly_active', label: 'Легкая активность (1-3 раза в неделю)' },
  { value: 'moderately_active', label: 'Умеренная активность (3-5 раз в неделю)' },
  { value: 'very_active', label: 'Высокая активность (6-7 раз в неделю)' },
  { value: 'extremely_active', label: 'Очень высокая активность (спортсмен)' },
];

const GOALS = [
  { value: 'lose_weight', label: 'Похудение' },
  { value: 'maintain_weight', label: 'Поддержание веса' },
  { value: 'gain_weight', label: 'Набор веса' },
];

const GENDERS = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'other', label: 'Не указан' },
];

export const DietDiarySettings: FC = () => {
  const { me } = useAuth();
  const user = me as IUser;

  const dispatch = useAppDispatch();

  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState<number>();

  const [changeProfile, { isLoading: isUpdateLoading }] = useChangeProfileMutation();

  const indexes = Array.from({ length: 10 }, (_, index) => index + 1);

  const calculateBMI = (weight?: Nullable<number>, height?: Nullable<number>) => {
    if (weight && height) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Недостаточный вес', color: 'blue' };
    if (bmi < 25) return { label: 'Нормальный вес', color: 'green' };
    if (bmi < 30) return { label: 'Избыточный вес', color: 'yellow' };
    return { label: 'Ожирение', color: 'red' };
  };

  // Простая формула расчета BMR (базовый обмен веществ)
  const calcBmr = (values: Partial<IUserWithTargets>): number => {
    let bmr;
    if (values.gender === 'male') {
      bmr =
        88.362 +
        13.397 * (values.weight || 0) +
        4.799 * (values.height || 0) -
        5.677 * (values.age || 0);
    } else {
      bmr =
        447.593 +
        9.247 * (values.weight || 0) +
        3.098 * (values.height || 0) -
        4.33 * (values.age || 0);
    }

    // Множители активности
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9,
    };

    const tdee =
      bmr * (activityMultipliers[values.activityLevel as keyof typeof activityMultipliers] || 1.2);

    // Корректировка по цели
    let recommended = tdee;
    if (values.goal === 'lose_weight') {
      recommended = tdee - 300; // Дефицит 500 калорий для похудения
    } else if (values.goal === 'gain_weight') {
      recommended = tdee + 300; // Профицит 300 калорий для набора веса
    }

    return recommended;
  };

  const handleSelectAvatar = (index: number) => {
    setSelected(index);
  };

  const [changeAvatar] = useChangeAvatarMutation();

  const handleSaveAvatar = () => {
    if (me && selected) {
      changeAvatar({ userId: me._id, avatarId: selected.toString() });
      dispatch(profileActions.changeAvatar(selected));
      close();
    }
  };

  const handleChangeProfile = (data: Partial<IUserWithTargets>) => {
    changeProfile({ user: data });
    dispatch(profileActions.changeLogin(data.login));
  };

  return (
    <Formik
      initialValues={{
        _id: user._id,
        email: user.email,
        login: user.login || '',
        avatarId: user.avatarId,
        height: user.config.height || null,
        weight: user.config.weight || null,
        targetWeight: user.config.targets.targetWeight || null,
        calories: user.config.targets.targetStat.calories || null,
        proteins: user.config.targets.targetStat.proteins || null,
        proteinsG: user.config.targets.targetStat.proteinsG || null,
        carbs: user.config.targets.targetStat.carbs || null,
        fats: user.config.targets.targetStat.fats || null,
        age: user.config.age || null,
        gender: (user.config.gender || 'other') as Gender,
        activityLevel: (user.config.activityLevel || 'sedentary') as ActivityLevel,
        goal: user.config.goal || '',
      }}
      onSubmit={handleChangeProfile}
      enableReinitialize
    >
      {({ values, initialValues, setFieldValue }) => {
        const bmi = calculateBMI(values.weight, values.height);

        return (
          <Form>
            <Stack gap='lg'>
              {/* Аватар и основная информация */}
              <Card withBorder p='md'>
                <Group>
                  <Avatar
                    src={getAvatarSrc(values?.avatarId)}
                    size='xl'
                    radius='xl'
                    alt={values?.login || 'Пользователь'}
                  />
                  <Stack gap='xs' style={{ flex: 1 }}>
                    <Title order={4}>{initialValues?.login || 'Пользователь'}</Title>
                    <Text size='sm' c='dimmed'>
                      {initialValues?.email || ''}
                    </Text>

                    <Group mt='md'>
                      <Button
                        onClick={open}
                        variant='light'
                        color='violet'
                        size='compact-md'
                        radius='md'
                      >
                        Изменить аватар
                      </Button>
                      <Button variant='subtle' color='red' size='compact-md'>
                        Удалить аватар
                      </Button>
                    </Group>
                  </Stack>

                  <Modal
                    zIndex={1000}
                    opened={opened}
                    onClose={close}
                    title='Выберите Аватар'
                    centered
                  >
                    <Card withBorder padding='xl' radius='md'>
                      <Group gap='xl'>
                        {[
                          indexes.map((it) => (
                            <Avatar
                              src={getAvatarSrc(it)}
                              size={80}
                              radius={80}
                              mx='auto'
                              style={
                                it === selected
                                  ? { border: '4px solid var(--mantine-color-blue-6)' }
                                  : {}
                              }
                              key={it}
                              alt={`avatar-${it}`}
                              onClick={() => handleSelectAvatar(it)}
                            />
                          )),
                        ]}
                      </Group>
                      <Button
                        onClick={handleSaveAvatar}
                        fullWidth
                        radius='md'
                        mt='xl'
                        size='md'
                        variant='default'
                      >
                        Сохранить
                      </Button>
                    </Card>
                  </Modal>
                </Group>
              </Card>

              {/* Основная информация */}
              <Card withBorder p='sm'>
                <Title order={4} mb='md'>
                  Основная информация
                </Title>
                <Stack gap='xs'>
                  <InputWrapper name='login' label='Логин' placeholder='Введите новый логин' />
                  <InputWrapper name='email' label='Email' disabled />
                  <Group grow>
                    <InputWrapper
                      name='age'
                      label='Возраст (лет)'
                      mode='number'
                      placeholder='25'
                      min={10}
                      max={120}
                    />

                    <InputWrapper
                      name='gender'
                      label='Пол'
                      mode='select'
                      placeholder='Выберите пол'
                      data={GENDERS}
                      onChange={(e) => setFieldValue('gender', e)}
                    />
                  </Group>
                </Stack>
              </Card>

              {/* Физические параметры */}
              <Card withBorder p='md'>
                <Title order={4} mb='md'>
                  Физические параметры
                </Title>
                <Stack gap='xs'>
                  <Group grow>
                    <InputWrapper
                      name='height'
                      label='Рост (см)'
                      mode='number'
                      placeholder='175'
                      min={100}
                      max={250}
                    />
                    <InputWrapper
                      name='weight'
                      label='Текущий вес (кг)'
                      mode='number'
                      placeholder='70'
                      min={30}
                      max={300}
                    />
                  </Group>

                  <InputWrapper
                    name='targetWeight'
                    label='Желаемый вес (кг)'
                    mode='number'
                    placeholder='65'
                    min={30}
                    max={300}
                  />

                  {/* BMI информация */}
                  {bmi && (
                    <Card withBorder p='sm'>
                      <Group justify='space-between'>
                        <Text size='sm' fw={500}>
                          Индекс массы тела (ИМТ):
                        </Text>
                        <Badge color={getBMICategory(parseFloat(bmi)).color} variant='light'>
                          {getBMICategory(parseFloat(bmi)).label}
                        </Badge>
                      </Group>
                    </Card>
                  )}
                </Stack>
              </Card>

              {/* Цели и активность */}
              <Card withBorder p='md'>
                <Title order={4} mb='md'>
                  Цели и активность
                </Title>
                <Stack gap='xs'>
                  <InputWrapper
                    name='activityLevel'
                    label='Уровень активности'
                    mode='select'
                    placeholder='Выберите уровень активности'
                    data={ACTIVITY_LEVELS}
                    onChange={(e) => setFieldValue('activityLevel', e)}
                  />
                  <InputWrapper
                    name='goal'
                    label='Цель'
                    mode='select'
                    placeholder='Выберите цель'
                    data={GOALS}
                    onChange={(e) => setFieldValue('goal', e)}
                  />
                  <InputWrapper
                    name='calories'
                    label='Цель по калориям на день'
                    mode='number'
                    placeholder='2000'
                    min={800}
                    max={5000}
                  />
                </Stack>
              </Card>

              {/* Рекомендации по калориям */}
              {values.age &&
                values.weight &&
                values.height &&
                values.gender &&
                values.activityLevel && (
                  <Card withBorder p='md'>
                    <Title order={6} mb='sm' c='blue'>
                      💡 Рекомендации
                    </Title>
                    <Text size='sm'>
                      На основе ваших параметров рекомендуемое количество калорий: ~
                      {Math.round(calcBmr(values))} ккал
                    </Text>
                  </Card>
                )}

              {/* Цели БЖУ */}
              <Card withBorder p='md'>
                <Title order={4} mb='md'>
                  Макроэлементы
                </Title>
                <Stack gap='xs'>
                  <Group justify='space-between'>
                    <Text>Белки</Text>
                    <Text c='dimmed' size='sm'>
                      {`${values.proteinsG || '-'}  г`}
                    </Text>

                    <InputWrapper
                      name='proteins'
                      mode='number'
                      placeholder='30'
                      onChange={(e) => {
                        setFieldValue('proteins', e);
                        setFieldValue(
                          'proteinsG',
                          round((Number(values.calories) * Number(e)) / 400, 1),
                        );
                      }}
                      rightSection='%'
                      height={36}
                    />
                  </Group>

                  <Group justify='space-between'>
                    <Text>Жиры</Text>
                    <Text c='dimmed' size='sm'>
                      {`${values.fatsG || '-'}  г`}
                    </Text>

                    <InputWrapper
                      name='fats'
                      mode='number'
                      placeholder='25'
                      onChange={(e) => {
                        setFieldValue('fats', e);
                        setFieldValue(
                          'fatsG',
                          round((Number(values.calories) * Number(e)) / 900, 1),
                        );
                      }}
                      rightSection='%'
                      height={36}
                    />
                  </Group>

                  <Group justify='space-between'>
                    <Text>Углеводы</Text>
                    <Text c='dimmed' size='sm'>
                      {`${values.carbsG || '-'}  г`}
                    </Text>

                    <InputWrapper
                      name='carbs'
                      mode='number'
                      placeholder='45'
                      onChange={(e) => {
                        setFieldValue('carbs', e);
                        setFieldValue(
                          'carbsG',
                          round((Number(values.calories) * Number(e)) / 400, 1),
                        );
                      }}
                      rightSection='%'
                      height={36}
                    />
                  </Group>
                </Stack>
              </Card>

              <Divider />

              <Group justify='flex-end' gap='xs'>
                <Button type='submit' loading={isUpdateLoading}>
                  Сохранить профиль
                </Button>
              </Group>
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
};
