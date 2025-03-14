import { FC } from 'react';

export type LinkItem = {
  title: string;
  href: string;
  description: string;
  hasChildren?: boolean;
};

export type LinkCollection = {
  name: string;
  description?: string;
  basePath: string;
  icon?: FC<{ className?: string }>;
  items: LinkItem[];
};
