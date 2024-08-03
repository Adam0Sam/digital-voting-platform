import { FC, PropsWithChildren } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const CardWrapper: FC<
  PropsWithChildren<{ cardTitle: string; cardDescription: string }>
> = ({ children, cardTitle, cardDescription }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-8">
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
