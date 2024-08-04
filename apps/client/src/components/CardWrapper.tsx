import { FC, PropsWithChildren } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { cn } from '@/lib/utils';

const CardWrapper: FC<
  PropsWithChildren<{
    cardTitle?: string;
    cardDescription?: string;
    className?: string;
  }>
> = ({ children, cardTitle, cardDescription, className }) => {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="items-center pb-8">
        <CardTitle>{cardTitle ?? ''}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {children ?? ''}
      </CardContent>
    </Card>
  );
};

export default CardWrapper;
