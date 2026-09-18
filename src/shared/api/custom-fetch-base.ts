import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { ToastLevel, useToast } from '../hook';
import { pathKeys } from '../lib';
import { appActions, authActions, authSlice, profileActions, RootState } from '../model';

import { BASE_URL } from './api';
import { ResultCodes } from './api-types';

const baseUrl = BASE_URL;

const mutex = new Mutex();

const baseQuery = (customBaseUrl?: string, validateStatus?: any) =>
  fetchBaseQuery({
    baseUrl: `${baseUrl}${customBaseUrl || 'api'}`,
    prepareHeaders: async (headers) => {
      const token = window.localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Access-Control-Allow-Origin', `*`);
      headers.set('x-vercel-protection-bypass', process.env.VERCEL || '');
      return headers;
    },
    validateStatus,
  });

const logout = (api: BaseQueryApi) => {
  api.dispatch(authActions.logout());
  api.dispatch(appActions.setUninitialized());
  window.location.href = pathKeys.login();
};

const customFetchBase =
  (
    customBaseUrl?: string,
    validateStatus?: any,
  ): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
  async (args, api, extraOptions) => {
    const rootState = api.getState() as RootState;
    const isAuth = rootState[authSlice.reducerPath].isAuth;

    await mutex.waitForUnlock();
    let result;

    if (localStorage.getItem('token') && !isAuth) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();

        try {
          const refreshResult: any = await baseQuery(undefined, validateStatus)(
            { url: '/auth/status' },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            api.dispatch(appActions.setInitialized());
            api.dispatch(profileActions.setProfile(refreshResult.data.data));
            api.dispatch(authActions.setAuth(refreshResult.data.data));
            window.localStorage.setItem('token', refreshResult.data.token);

            result = await baseQuery(customBaseUrl, validateStatus)(args, api, extraOptions);
          } else {
            logout(api);
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(customBaseUrl, validateStatus)(args, api, extraOptions);
      }
    } else {
      result = await baseQuery(customBaseUrl, validateStatus)(args, api, extraOptions);
      if (result.error && result.error.status === ResultCodes.AccessDenied) {
        logout(api);
      }
    }

    if (result && result.error && result.error.data?.message) {
      useToast({
        level: ToastLevel.ERROR,
        message: result.error.data.message,
      });
    }

    return result;
  };

export default customFetchBase;
