import { Candidate } from '@ambassador';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

type CandidateCardProps = {
  candidate: Candidate;
  handleClick: () => void;
  isSelected: boolean;
  className?: string;
};

export default function CandidateCard({
  candidate,
  handleClick,
  isSelected,
  className,
}: CandidateCardProps) {
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
        <CardTitle className="text-xl">{candidate.value}</CardTitle>
        <CardDescription>{candidate.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
