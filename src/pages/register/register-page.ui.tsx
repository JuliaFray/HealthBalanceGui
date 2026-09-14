import React, { FC, useEffect } from 'react';

import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';

import { Box, Button, LoadingOverlay, Paper, Stack, Title } from '@mantine/core';

import { ToastLevel, useAppSelector, useToast } from 'shared/hook';
import { pathKeys } from 'shared/lib';
import { authSelector } from 'shared/model';
import { RegisterDataType } from 'shared/types';
import { InputWrapper } from 'shared/ui';

import { useRegister } from './register-page.hook';
import styles from './register-page.module.scss';

export const RegisterPage: FC = () => {
  const { formikConfig, validationSchema, handleSubmit, isFetching, handleOnChange } =
    useRegister();

  const showSuccessSend = useAppSelector(authSelector.getSuccessSend);

  useEffect(() => {
    if (showSuccessSend) {
      useToast({
        level: ToastLevel.SUCCESS,
        message: 'Письмо отправлено на ваш адрес электронной почты',
      });
    }
  }, [showSuccessSend]);

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
        <Stack gap='sm'>
          <Title classNames={{ root: styles.title }} order={3}>
            Создать аккаунт
          </Title>

          <Formik
            onSubmit={(values: RegisterDataType) => handleSubmit(values)}
            validationSchema={validationSchema}
            {...formikConfig}
          >
            {({ isValid }) => (
              <Form onChange={handleOnChange}>
                <Stack gap='sm'>
                  <InputWrapper name='login' label='Логин' />
                  <InputWrapper name='email' label='Email' />
                  <InputWrapper name='password' label='Пароль' mode='password-check' />

                  <Button
                    type='submit'
                    size='compact-lg'
                    mt={10}
                    disabled={!isValid || isFetching}
                    fullWidth
                  >
                    Зарегистрироваться
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>

          <Link className={styles.link} to={pathKeys.login()}>
            Войти в аккаунт
          </Link>
        </Stack>
      </Paper>
    </Stack>
  );
};
