import React from 'react';

import { Accordion } from '@mantine/core';

import { DietDiarySettings } from '../diet-diary-settings';
import { UiConfigSetting } from '../ui-config-settings';

import classes from './settings-accordion.module.scss';

export const SettingsAccordion = () => {
  return (
    <Accordion variant='separated'>
      <Accordion.Item className={classes.item} value='my-profile'>
        <Accordion.Control>Мой профиль</Accordion.Control>
        <Accordion.Panel>
          <DietDiarySettings />
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item className={classes.item} value='ui-config'>
        <Accordion.Control>Настройки интерфейса</Accordion.Control>
        <Accordion.Panel>
          <UiConfigSetting />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
