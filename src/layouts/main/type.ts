import { ReactElement } from 'react';

// ----------------------------------------------------------------------

export type MenuItemProps = {
  title: string;
  path: string;
  icon?: ReactElement;
  children?: {
    subheader: string;
    items: {
      title: string;
      path: string;
    }[];
  }[];
  demo?: boolean;
};

export type MenuProps = {
  isOffset: boolean;
  isHome: boolean;
  navConfig: MenuItemProps[];
};
