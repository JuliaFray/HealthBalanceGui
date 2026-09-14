import React, { FC } from 'react';

import { Stack } from '@mantine/core';

import { mealsOptions } from 'shared/constants';
import { InputWrapper } from 'shared/ui';

export const DietParams: FC = () => {
  return (
    <Stack gap='sm'>
      <InputWrapper name='name' label='Название плана' />
      <InputWrapper name='period' label='Количество дней' mode='number' max={7} />
      <InputWrapper name='meals' label='Приемы пищи' mode='multiselect' data={mealsOptions} />
    </Stack>
  );
};
