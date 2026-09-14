import { useMediaQuery } from '@mantine/hooks';

export const useMedia = (breakPoint = '(min-width: 70em)') => {
  const isMore1200px = useMediaQuery(breakPoint);
  const mdMain = isMore1200px ? 8 : 12;
  const mdSide = isMore1200px ? 4 : 0;

  return { mdMain, mdSide, isMore1200px };
};
