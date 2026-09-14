import React, { createElement, lazy } from 'react';

import { RouteObject } from 'react-router-dom';

import { Skeleton } from '@mantine/core';

import { compose, pathKeys, withSuspense } from 'shared/lib';

const DietDiaryPage = lazy(() =>
  import('./diet-diary-page.ui').then((module) => ({ default: module.DietDiaryPage })),
);

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: () => <Skeleton visible /> }),
);

export const dietDiaryPageRoute: RouteObject = {
  path: pathKeys.diary.root(),
  element: createElement(enhance(DietDiaryPage)),
};
