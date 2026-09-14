import React, { useState } from 'react';

import { BellIcon, BellRingingIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { v4 as uuidv4 } from 'uuid';

import { Box } from '@mui/material';

import { ActionIcon, Button, Divider, Indicator, List, Popover, Stack } from '@mantine/core';

import { useAuth } from '../../context';
import { useAppDispatch, useAppSelector } from '../../hook';
import { pathKeys } from '../../lib';
import { appActions, appSelector, toggleFriendProfile } from '../../model';
import { INotifications } from '../../types';

import styles from './Header.module.scss';

const NotificationTypes = {
  FOLLOW: 'FOLLOW',
  FRIEND: 'FRIEND',
  MSG: 'MSG',
};

const NotificationItem: React.FC<{ item?: INotifications; text?: string }> = ({ item, text }) => {
  const dispatch = useAppDispatch();
  const { authId } = useAuth();

  if (!item) {
    return (
      <>
        <Box key={uuidv4()} className={styles.item}>
          {text}
        </Box>
        <Divider />
      </>
    );
  }

  const toggleAgree = (isAgree: boolean) => {
    if (authId) {
      dispatch(
        toggleFriendProfile({
          userId: authId,
          query: `?fromId=${item.fromId}&isAgree=${isAgree}`,
        }),
      );
    }
  };

  if (item.type === NotificationTypes.FOLLOW || item.type === NotificationTypes.MSG) {
    return (
      <>
        <Box key={uuidv4()} className={styles.item}>
          {reactStringReplace(item.msg, '%s', () => (
            <Link to={pathKeys.user.byId({ id: item.fromId })}>{item.from}</Link>
          ))}
        </Box>
        <Divider />
      </>
    );
  }

  if (item.type === NotificationTypes.FRIEND) {
    return (
      <>
        <Box key={uuidv4()} className={styles.item}>
          {reactStringReplace(item.msg, '%s', () => (
            <Link to={pathKeys.user.byId({ id: item.fromId })}>{item.from}</Link>
          ))}
          <Box className={styles.subItem}>
            <Button
              size='small'
              variant='outlined'
              color='error'
              onClick={() => toggleAgree(false)}
            >
              Отклонить
            </Button>

            <Button
              size='small'
              variant='outlined'
              color='primary'
              onClick={() => toggleAgree(true)}
            >
              Принять
            </Button>
          </Box>
        </Box>
        <Divider />
      </>
    );
  }
  return (
    <Box key={uuidv4()} className={styles.item}>
      Уведомлений нет
    </Box>
  );
};

export const NotificationIcon = () => {
  const notifs = useAppSelector(appSelector.getAppAllNotifications);

  if (!notifs || !notifs.length) {
    return <BellIcon size={24} weight='light' color='white' />;
  }
  return <BellRingingIcon size={24} weight='fill' color='white' />;
};

export const NotificationBlock: React.FC = () => {
  const [opened, setOpened] = useState(false);

  const notifications = useAppSelector(appSelector.getAppAllNotifications);

  const dispatch = useAppDispatch();

  const onShowNotification = () => {
    setOpened((o) => !o);
  };

  const handleReadAll = () => {
    dispatch(appActions.removeNotification());
  };

  return (
    <Popover
      width={300}
      position='bottom'
      withArrow
      shadow='md'
      classNames={styles.notifications}
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ActionIcon
          id='ntf'
          onClick={onShowNotification}
          aria-label='notifications'
          variant='transparent'
        >
          <NotificationIcon />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown bg='var(--mantine-color-body)'>
        <Stack>
          {notifications.length ? (
            notifications.map((it: INotifications) => <NotificationItem key={uuidv4()} item={it} />)
          ) : (
            <NotificationItem key={uuidv4()} text='Уведомлений нет' />
          )}

          <Button className={styles.btn} onClick={handleReadAll} disabled={!notifications.length}>
            Отметить все прочитанными
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
