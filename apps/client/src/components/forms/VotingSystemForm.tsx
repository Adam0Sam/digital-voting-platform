'use client';

import { useState } from 'react';
import { VotingSystem, VotingSystems } from '@ambassador/voting-system';
import { ExtendedFormProps, WithRequiredSubmit } from './interface';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import FormHandleButtons from './FormHandleButtons';
import { cn } from '@/lib/utils';

type FormValues = { system: VotingSystem };
export type VotingSystemFormProps = WithRequiredSubmit<
  ExtendedFormProps<FormValues>
>;

const votingSystemDescriptions = {
  FIRST_PAST_THE_POST:
    'The candidate with the most votes wins, even without a majority.',
  INSTANT_RUNOFF:
    'Voters rank candidates. The lowest-ranked candidate is eliminated, and their votes redistributed until a majority is reached.',
  ABSOLUTE_MAJORITY:
    'A candidate must receive more than 50% of the votes to win. If no candidate achieves this, a second round is held between the top two candidates.',
};

export default function VotingSystemForm({
  onSubmit,
  onCancel,
}: VotingSystemFormProps) {
  const [selectedSystem, setSelectedSystem] = useState<VotingSystem | null>(
    null,
  );

  return (
    <div className="space-y-20">
      <div className="space-y-6">
        <h2 className="text-center text-2xl font-bold">
          {selectedSystem ? VotingSystem[selectedSystem] : 'None'}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {VotingSystems.map(system => (
            <Card
              key={system}
              className={`relative cursor-pointer ${
                selectedSystem === system
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background'
              }`}
              onClick={() => setSelectedSystem(system)}
            >
              <CardContent className="flex flex-col p-0 pb-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="mr-2 mt-2 h-5 w-5 self-end text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-40">
                        {votingSystemDescriptions[system]}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <h3 className="mx-4 self-center font-semibold">
                  {VotingSystem[system]}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <FormHandleButtons
        submitClassName={cn({
          'bg-gray-200 text-gray-500 opacity-80 cursor-default':
            selectedSystem === null,
        })}
        handleSubmitClick={() => {
          if (selectedSystem === null) {
            return;
          }
          onSubmit({ system: selectedSystem });
        }}
        handleCancelClick={onCancel}
      />
    </div>
  );
}
