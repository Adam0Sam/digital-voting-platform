import { ProposalChoiceDto } from '@/lib/types';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

export default function ChoiceCard({
  choiceData,
  handleClick,
  isSelected,
  className,
}: {
  choiceData: ProposalChoiceDto;
  handleClick: () => void;
  isSelected: boolean;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        `cursor-pointer border-secondary hover:bg-primary-foreground`,
        {
          'bg-secondary': isSelected,
          'border-primary': isSelected,
        },
        className,
      )}
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <CardTitle className="text-xl">{choiceData.value}</CardTitle>
        <CardDescription>{choiceData.description}</CardDescription>
      </CardContent>
    </Card>
  );
}