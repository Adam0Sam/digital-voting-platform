import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { useNavigate } from 'react-router-dom';
import { Vote, ClipboardList, PlusCircle } from 'lucide-react';

const actions = [
  {
    title: 'Vote on Proposals',
    description: 'Participate in active proposals and make your voice heard.',
    icon: Vote,
    href: PROPOSAL_HREFS.VOTE_ALL,
  },
  {
    title: 'Manage Proposals',
    description: "Review and oversee the proposals you're responsible for.",
    icon: ClipboardList,
    href: PROPOSAL_HREFS.MANAGE_ALL,
  },
  {
    title: 'Create a Proposal',
    description: 'Start a new proposal and gather feedback from the community.',
    icon: PlusCircle,
    href: PROPOSAL_HREFS.CREATE,
  },
];

export default function ProposalGreetingPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-24 text-center text-4xl font-bold">
        Welcome to Proposals
      </h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-6">
        {actions.map(action => (
          <Card key={action.href} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <action.icon className="h-6 w-6" />
                {action.title}
              </CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-grow items-end">
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate(action.href)}
              >
                {action.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
