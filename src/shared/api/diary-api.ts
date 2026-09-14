// eslint-disable-next-line import/no-unresolved
import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/dist/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';

import { AddFoodType, IDiaryRecord, Nutrients } from '../types';

import { CountResponseType, GenericResponseType } from './api-types';
import customFetchBase from './custom-fetch-base';

const baseUrl = '/diary';

export const diaryApi = createApi({
  reducerPath: 'diaryApi',
  baseQuery: customFetchBase(baseUrl),
  endpoints: (build: EndpointBuilder<BaseQueryFn, string, string>) => ({
    getDiaryByDay: build.query<CountResponseType<IDiaryRecord>, { date: string }>({
      query: ({ date }) => {
        const searchParams = new URLSearchParams();
        searchParams.append('date', date);

        return {
          url: ``,
          method: 'GET',
          params: searchParams,
        };
      },
      providesTags: (result, error, arg) => [{ type: 'getDiaryByDay', id: arg.date }],
    }),
    addFoodToDiary: build.mutation<void, AddFoodType>({
      query: (data) => {
        return {
          url: `/add-food`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: (result, error, { date }) => [
        { type: 'getDiaryByDay', id: date },
        { type: 'getFilledDates' },
        { type: 'getDayStat', id: date },
      ],
    }),
    removeDiaryRecord: build.mutation<
      void,
      {
        foodId: string;
        day: string;
      }
    >({
      query: ({ foodId, day }) => {
        return {
          url: `/remove-food`,
          method: 'PUT',
          body: { foodId, day },
        };
      },
      invalidatesTags: (result, error, { day }) => [
        { type: 'getDiaryByDay', id: day },
        { type: 'getFilledDates' },
        { type: 'getDayStat', id: day },
      ],
    }),
    getFilledDates: build.query<GenericResponseType<string[]>, void>({
      query: () => {
        return {
          url: `/dates`,
          method: 'GET',
        };
      },
      providesTags: () => [{ type: 'getFilledDates' }],
    }),
    getDayStat: build.query<GenericResponseType<Nutrients>, { date: string }>({
      query: ({ date }) => {
        const searchParams = new URLSearchParams();
        searchParams.append('date', date);
        return {
          url: `/day-stats`,
          method: 'GET',
          params: searchParams,
        };
      },
      providesTags: (result, error, arg) => [{ type: 'getDayStat', id: arg.date }],
    }),
  }),
});

export const {
  useLazyGetDiaryByDayQuery,
  useAddFoodToDiaryMutation,
  useRemoveDiaryRecordMutation,
  useGetFilledDatesQuery,
  useGetDayStatQuery,
} = diaryApi;
