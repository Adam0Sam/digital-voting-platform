import { cn, getProgressBetweenDates } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { format } from 'date-fns';
import { Proposal } from '@ambassador';

export type TimelineMarker = {
  positionPercentage: number;
  label: string;
  tooltipNode?: React.ReactNode;
};

type TimelineProps = {
  progressPercentage: number;
  markers?: TimelineMarker[];
};

export function constructMarkerArray(
  proposal: Pick<Proposal, 'startDate' | 'endDate' | 'resolutionDate'>,
) {
  const getProgress = getProgressBetweenDates(
    new Date(proposal.startDate),
    new Date(proposal.endDate),
  );

  const markers = [
    {
      label: `Proposal Start`,
      positionPercentage: getProgress(new Date(proposal.startDate)),
      tooltipNode: <p>{format(proposal.startDate, 'MMM d, yyyy')}</p>,
    },
    {
      label: 'Resolution Date',
      positionPercentage: getProgress(new Date(proposal.resolutionDate)),
      tooltipNode: <p>{format(proposal.resolutionDate, 'MMM d, yyyy')}</p>,
    },
  ];

  if (
    new Date(proposal.resolutionDate).getTime() ===
    new Date(proposal.endDate).getTime()
  ) {
    return markers;
  }
  return [
    ...markers,
    {
      label: 'Proposal End',
      positionPercentage: getProgress(new Date(proposal.endDate)),
      tooltipNode: <p>{format(proposal.endDate, 'MMM d, yyyy')}</p>,
    },
  ];
}

export default function Timeline(props: TimelineProps) {
  return (
    <div className="relative mb-8 h-4 rounded-full bg-secondary">
      <div
        style={{ width: `${props.progressPercentage}%` }}
        className={`absolute left-0 top-0 h-full rounded-full bg-primary`}
      />
      <TooltipProvider>
        {props.markers?.map((marker, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                key={index}
                className={cn(
                  `absolute z-10 h-6 w-2 -translate-y-1 transform cursor-pointer rounded-sm`,
                  {
                    'bg-muted-foreground text-muted-foreground':
                      marker.positionPercentage <= props.progressPercentage,
                    'bg-primary text-primary':
                      marker.positionPercentage > props.progressPercentage,
                  },
                )}
                style={{ left: `${Math.max(marker.positionPercentage)}%` }}
              >
                <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 transform text-xs">
                  {marker.label}
                </span>
              </div>
            </TooltipTrigger>
            {marker.tooltipNode && (
              <TooltipContent side="top">{marker.tooltipNode}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
