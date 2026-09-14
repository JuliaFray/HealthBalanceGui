import React, { FC, useState } from 'react';

import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { useField } from 'formik';

import type {
  InputProps,
  MultiSelectProps,
  NumberInputProps,
  PasswordInputProps,
  SelectProps,
} from '@mantine/core';
import {
  Box,
  Input,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Popover,
  Progress,
  Select,
  Text,
} from '@mantine/core';

interface Props {
  name: string;
  label?: string;
  mode?: 'string' | 'password' | 'number' | 'select' | 'multiselect' | 'password-check';
  height?: number;
}

type CustomInputProps =
  | PasswordInputProps
  | InputProps
  | NumberInputProps
  | SelectProps
  | MultiSelectProps;

const requirements = [
  { re: /[0-9]/, label: 'Цифры' },
  { re: /[a-z]/, label: 'Буквы в нижнем регистре' },
  { re: /[A-Z]/, label: 'Буквы в верхнем регистре' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Специальные символы' },
];

const PasswordRequirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size='sm'
    >
      {meets ? <CheckIcon size={14} /> : <XIcon size={14} />}
      <Box ml={10}>{label}</Box>
    </Text>
  );
};

const getStrength = (password?: string): number => {
  if (password) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }
  return 0;
};

export const InputWrapper: FC<Props & CustomInputProps> = ({
  name,
  label,
  mode = 'string',
  height = 65,
  ...otherProps
}) => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [field, meta, helpers] = useField(name);

  const fieldConfig = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    fieldConfig.error = meta.error;
  }

  const strength = getStrength(field.value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(field.value)}
    />
  ));

  const handleCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Run your custom logic here
    console.log('New value:', event.target.value);

    // 2. Call Formik's default change handler
    field.onChange(event);
  };

  return (
    <Input.Wrapper
      style={{ height: `${height}px` }}
      className={fieldConfig.className}
      label={label}
      error={meta.error}
    >
      {mode === 'string' && <Input {...field} {...(otherProps as InputProps)} />}
      {mode === 'number' && (
        <NumberInput
          {...field}
          hideControls
          onChange={(e) => helpers.setValue(e)}
          value={field.value}
          {...(otherProps as NumberInputProps)}
        />
      )}
      {mode === 'password' && <PasswordInput {...field} {...(otherProps as PasswordInputProps)} />}
      {mode === 'password-check' && (
        <Popover
          opened={popoverOpened}
          position='bottom'
          width='target'
          transitionProps={{ transition: 'pop' }}
        >
          <Popover.Target>
            <div
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
            >
              <PasswordInput withAsterisk {...field} {...(otherProps as PasswordInputProps)} />
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Progress color={color} value={strength} size={5} mb='xs' />
            <PasswordRequirement label='Минимум 6 символов' meets={field.value.length > 5} />
            {checks}
          </Popover.Dropdown>
        </Popover>
      )}
      {mode === 'select' && <Select {...field} {...(otherProps as SelectProps)} />}
      {mode === 'multiselect' && (
        <MultiSelect
          {...field}
          {...(otherProps as MultiSelectProps)}
          onChange={(e) => helpers.setValue(e)}
        />
      )}
    </Input.Wrapper>
  );
};
