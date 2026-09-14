import React, { FC } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';

import { Indicator } from '@mantine/core';
import { Calendar, DatesProvider, MiniCalendar } from '@mantine/dates';

import { today } from 'shared/ui';

interface Props {
  isFull?: boolean;
  day: string;
  onDayChange: (day: string) => void;
  filledDates: string[];
}

export const WeekCalendar: FC<Props> = ({ day, onDayChange, filledDates, isFull = false }) => {
  return (
    <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 1, weekendDays: [0, 6] }}>
      {isFull && (
        <Calendar
          withCellSpacing={false}
          getDayProps={(date) => ({
            selected: dayjs(date).isSame(day, 'date'),
            onClick: () => onDayChange(date),
            highlightToday: true,
          })}
          renderDay={(date) => {
            const d = dayjs(date).date();
            return (
              <Indicator
                size={6}
                color='teal'
                offset={-2}
                disabled={!filledDates.some((dd) => dayjs(dd).isSame(date, 'date'))}
              >
                <div>{d}</div>
              </Indicator>
            );
          }}
        />
      )}

      {!isFull && (
        <MiniCalendar
          getDayProps={(date) => ({
            style: {
              border: dayjs(date).isSame(today, 'date')
                ? '1px solid var(--mantine-color-dark-4)'
                : undefined,
            },
          })}
          value={day}
          onChange={(e) => onDayChange(e)}
          numberOfDays={7}
          // renderDay={(date) => {
          //   const d = dayjs(date).date();
          //   return (
          //     <Indicator size={6} color='red' offset={-2} disabled={d !== 16}>
          //       <div>{day}</div>
          //     </Indicator>
          //   );
          // }}
        />
      )}
    </DatesProvider>
  );
};
