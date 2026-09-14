import React, { Dispatch, SetStateAction } from 'react';

import { HammerIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Fab, Grid } from '@mui/material';

import { Alert } from '@mantine/core';

import { ArticlesFeedSkeleton } from 'widgets/article';
import { DietCard } from 'widgets/diet';

import { useAuth } from 'shared/context';
import { useAppSelector } from 'shared/hook';
import { pathKeys } from 'shared/lib';
import { dietSelector } from 'shared/model';
import { IDietPlan } from 'shared/types';

type DietFeedProps = {
  isMainPage: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
};

export const DietsFeed: React.FC<DietFeedProps> = () => {
  const diets = useAppSelector(dietSelector.getDiets);

  return (
    <Box style={{ position: 'relative' }}>
      <Grid
        container
        sx={{ margin: 0 }}
        rowSpacing={{ xs: 1, sm: 2, md: 3 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{ marginTop: '-10px', marginBottom: '30px' }}
      >
        {!diets.length && (
          <Alert variant='light' color='blue' title='Ой' icon={<HammerIcon />}>
            Кажется, у Вас нет еще ни одного плана.
          </Alert>
        )}
        {diets.map((el: IDietPlan) => (
          <Grid item xs={12} sm={12} md={12} key={el._id}>
            <DietCard key={el._id} diet={el} />
          </Grid>
        ))}

        <Link to={pathKeys.planner.editor.root()}>
          <Fab
            color='primary'
            aria-label='edit'
            style={{ position: 'fixed', bottom: '20px', right: '20px' }}
          >
            <AddOutlinedIcon />
          </Fab>
        </Link>
      </Grid>
    </Box>
  );
};
