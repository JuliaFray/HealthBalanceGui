import React, { FC } from 'react';

import { Form, Formik } from 'formik';
import { Link, Navigate } from 'react-router-dom';

import { Button, LoadingOverlay, Paper, Stack, Title } from '@mantine/core';

import { useAuth } from 'shared/context';
import { useLastLocation } from 'shared/hook';
import { pathKeys } from 'shared/lib';
import { ILoginData } from 'shared/types';
import { InputWrapper } from 'shared/ui';

import { useLogin } from './login-page.hook';
import styles from './login-page.module.scss';

export const LoginPage: FC = () => {
  const { isAuth } = useAuth();
  const { currentPath } = useLastLocation();

  const { formikConfig, validationSchema, isFetching, handleSubmit, handleChange } = useLogin();

  if (isAuth) {
    const path =
      currentPath && ![pathKeys.login(), pathKeys.register()].includes(currentPath)
        ? currentPath
        : pathKeys.home();
    return <Navigate to={path} />;
  }

  return (
    <Stack style={{ display: 'flex' }}>
      <img
        alt='logo'
        style={{ width: '40em', alignSelf: 'center', marginBlock: '-10em' }}
        src={`${process.env.PUBLIC_URL}/TransparentLogo.png`}
      />

      <Paper classNames={{ root: styles.root }}>
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'teal', type: 'bars' }}
        />
        <Stack gap='lg'>
          <Title classNames={{ root: styles.title }} order={3}>
            Войти в аккаунт
          </Title>

          <Formik
            onSubmit={(values: ILoginData) => handleSubmit(values)}
            validationSchema={validationSchema}
            {...formikConfig}
          >
            {({ isValid }) => (
              <Form onChange={handleChange}>
                <Stack gap='xs'>
                  <InputWrapper label='Логин или Email' name='email' />
                  <InputWrapper label='Пароль' mode='password' name='password' />

                  <Button
                    type='submit'
                    size='compact-lg'
                    mt={10}
                    disabled={!isValid || isFetching}
                    fullWidth
                  >
                    Войти
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>

          <Link className={styles.link} to={pathKeys.register()}>
            Создать аккаунт
          </Link>
        </Stack>
      </Paper>
    </Stack>
  );
};
