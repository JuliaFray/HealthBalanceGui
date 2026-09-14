import React, { FC } from 'react';

import { NavLink } from 'react-router-dom';

import { Button, Group, Title } from '@mantine/core';

import { useAuth, useWebSocket } from 'shared/context';
import { useAppDispatch } from 'shared/hook';
import { pathKeys, SocketEvents } from 'shared/lib';
import { appActions, authActions } from 'shared/model';

import styles from './layout.module.scss';

export const BrandLink = () => {
  return (
    <NavLink className={styles.brandlink} to={pathKeys.home()}>
      <Title order={3}>
        <Group>
          <img
            alt='logo'
            style={{ height: '50px' }}
            src={`${process.env.PUBLIC_URL}/TransparentMascotLight.png`}
          />
          <span style={{ verticalAlign: 'middle' }}>HEALTH BALANCE</span>
        </Group>
      </Title>
    </NavLink>
  );
};

export const SignOutLink: FC = () => {
  const { authId } = useAuth();

  const dispatch = useAppDispatch();

  const ws = useWebSocket();

  const handleLogout = () => {
    ws?.send(JSON.stringify({ type: SocketEvents.LOGOUT_EVENT, id: authId }));
    dispatch(authActions.logout());
    dispatch(appActions.setUninitialized());
  };

  return <Button onClick={handleLogout}>Выйти из аккаунта</Button>;
};
