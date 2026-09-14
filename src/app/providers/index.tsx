import React from 'react';

import { withErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import { compose } from 'redux';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import { AuthProvider, WebSocketProvider } from 'shared/context';
import { useAppSelector, useLastLocation } from 'shared/hook';
import { spinnerSelector, store } from 'shared/model';
import { mantineTheme } from 'shared/themes';
import { ErrorHandler, logError, Spinner } from 'shared/ui';

import { BrowserRouting } from './RouterProvider';

const enhance = compose((component: React.ComponentType) =>
  withErrorBoundary(component, {
    FallbackComponent: ErrorHandler,
    onError: logError,
  }),
);

function GlobalSpinner() {
  const display = useAppSelector(spinnerSelector.getSpinnerDisplay);

  return <Spinner display={display} />;
}

export const AppProvider = enhance(() => (
  <Provider store={store}>
    <MantineProvider theme={mantineTheme}>
      <AuthProvider>
        <WebSocketProvider>
          <Notifications position='bottom-center' autoClose={10000} limit={5} />
          <GlobalSpinner />
          <BrowserRouting />
        </WebSocketProvider>
      </AuthProvider>
    </MantineProvider>
  </Provider>
));
