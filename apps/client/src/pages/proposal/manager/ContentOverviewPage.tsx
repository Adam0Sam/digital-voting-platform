import { useState } from 'react';
import TitleDescriptionForm from '@/components/forms/TitleDescriptionForm';
import { useManagerProposal } from './ProposalManagePage';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProposalStatus, ProposalVisibility } from '@ambassador';

export default function ContentOverviewPage() {
  const { proposal, permissions } = useManagerProposal();
  const [status, setStatus] = useState<ProposalStatus>(proposal.status);
  const [visibility, setVisibility] = useState<ProposalVisibility>(
    proposal.visibility,
  );

  return (
    <div className="flex flex-col items-center space-y-8 lg:flex-row lg:items-end lg:justify-around">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Proposal Content</CardTitle>
        </CardHeader>
        <CardContent>
          <TitleDescriptionForm
            titleLabel="Proposal Title"
            defaultTitle={proposal.title}
            titleEditDisabled={!permissions.canEditTitle}
            descriptionLabel="Proposal Description"
            defaultDescription={proposal.description}
            descriptionEditDisabled={!permissions.canEditDescription}
            disableSubmit={
              !permissions.canEditTitle && !permissions.canEditDescription
            }
            onSubmit={data => api.proposals.updateOne(proposal.id, data)}
          />
        </CardContent>
      </Card>

      <Card className="m-0">
        <CardHeader className="m-0">
          <CardTitle>Proposal Status and Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Status</Label>
            <RadioGroup
              value={status}
              onValueChange={value => setStatus(value as ProposalStatus)}
              disabled={!permissions.canEditStatus}
            >
              {Object.values(ProposalStatus).map(value => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`status-${value}`} />
                  <Label htmlFor={`status-${value}`}>{value}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={value =>
                setVisibility(value as ProposalVisibility)
              }
              disabled={!permissions.canEditVisibility}
            >
              {Object.values(ProposalVisibility).map(value => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={value} id={`visibility-${value}`} />
                  <Label htmlFor={`visibility-${value}`}>
                    {value.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {!permissions.canEditStatus && !permissions.canEditVisibility && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No edit permissions</AlertTitle>
              <AlertDescription>
                You don't have permission to edit the status or visibility of
                this proposal.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={async () =>
              await api.proposals.updateOne(proposal.id, { status, visibility })
            }
            disabled={
              !permissions.canEditStatus && !permissions.canEditVisibility
            }
          >
            Update Status and Visibility
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
