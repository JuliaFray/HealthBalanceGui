import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { Alert } from '@mui/material';

import { Grid } from '@mantine/core';

import { DietsFeed } from 'widgets/diet';

import { useLazyGetAllDietPlansQuery } from 'shared/api';
import { useAuth } from 'shared/context';
import { useAppDispatch, useAppSelector, useMedia } from 'shared/hook';
import { dietSelector } from 'shared/model';
import { CustomPagination } from 'shared/ui';

type TPostPage = {
  isOwner: boolean;
  isMainPage: boolean;
  userId: string;
  isFavorite: boolean;
  isLoad: boolean;
};
const DietPage: React.FC<TPostPage> = React.memo(({ isMainPage, userId, isOwner, isFavorite }) => {
  const { mdMain } = useMedia();

  const { isAuth } = useAuth();

  const isFetching = useAppSelector(dietSelector.getDietsIsFetching);
  const dataLength = useAppSelector(dietSelector.getDietsDataLength);

  const [currentPage, setCurrentPage] = useState(1);

  const [getAllDietPlans] = useLazyGetAllDietPlansQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    getAllDietPlans();
  }, [dispatch, isOwner, isFavorite, userId]);

  useEffect(() => {
    getAllDietPlans();
  }, [currentPage]);

  if (!isAuth) {
    return <Alert severity='error'>Вам необходимо авторизоваться, чтобы продолжить работу</Alert>;
  }

  return (
    <Grid>
      <Grid.Col span={mdMain}>
        <DietsFeed
          isMainPage={isMainPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <CustomPagination
          page={currentPage}
          dataLength={dataLength}
          setCurrentPage={setCurrentPage}
        />
      </Grid.Col>
      {/* {isMainPage && <Grid item md={mdSide} className={styles.right}/>} */}
    </Grid>
  );
});

const mapStateToProps = () => ({
  isOwner: false,
  isMainPage: true,
  userId: '',
  isFavorite: false,
});

const GenericDietPage = compose<React.ComponentType & TPostPage>(connect(mapStateToProps))(
  DietPage,
);
export { DietPage, GenericDietPage };
