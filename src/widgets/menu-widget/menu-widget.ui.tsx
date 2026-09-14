import React, { FC, useEffect, useState } from 'react';

import {
  ArticleIcon,
  GearSixIcon,
  ListChecksIcon,
  NotePencilIcon,
  RulerIcon,
  SneakerMoveIcon,
} from '@phosphor-icons/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Group } from '@mantine/core';

import { useAuth } from 'shared/context';
import { pathKeys } from 'shared/lib';
import { UserButton } from 'shared/ui';

import { SignOutLink } from '../../app/layouts/layout.ui';

import classes from './NavbarSimple.module.scss';

type IItem = {
  name: string;
  link: string;
  icon: any;
  pathname: string;
};

const items: IItem[] = [
  {
    name: 'Дневник питания',
    pathname: 'diary',
    link: pathKeys.diary.root(),
    icon: NotePencilIcon,
  },
  {
    name: 'Планы питания',
    pathname: 'planner',
    link: pathKeys.planner.root(),
    icon: ListChecksIcon,
  },
  { name: 'Тренировки', pathname: 'training', link: pathKeys.root, icon: SneakerMoveIcon },
  {
    name: 'Вес и измерения',
    pathname: 'measure',
    link: pathKeys.measure.root(),
    icon: RulerIcon,
  },
  {
    name: 'Общая лента',
    pathname: 'article',
    link: pathKeys.home(),
    icon: ArticleIcon,
  },
  { name: 'Настройки', pathname: 'settings', link: pathKeys.root, icon: GearSixIcon },
];

interface MenuWidgetProps {
  close: () => void;
}

export const MenuWidget: FC<MenuWidgetProps> = ({ close }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { me } = useAuth();

  const [selected, setSelected] = useState<string | undefined>();

  useEffect(() => {
    setSelected(pathname?.replaceAll('/', ''));
    close();
  }, [pathname]);

  const links = items.map((item) => (
    <a
      className={classes.link}
      data-active={selected?.startsWith(item.pathname) || undefined}
      href={item.link}
      key={item.pathname}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.pathname);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.name}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify='space-between'>
          {me && <UserButton user={me} />}
        </Group>
        {links}
      </div>
      <SignOutLink />
    </nav>
  );
};
