import { Button } from '@/components/ui/button';
import { PROPOSAL_HREFS } from '@/lib/routes';
import { useNavigate } from 'react-router-dom';

export default function ProposalGreetingPage() {
  const navigate = useNavigate();
  return (
    <div className="mt-64 flex flex-wrap justify-center gap-12">
      <Button size="lg" onClick={() => navigate(PROPOSAL_HREFS.VOTE_ALL)}>
        Vote on Proposals
      </Button>
      <Button size="lg" onClick={() => navigate(PROPOSAL_HREFS.MANAGE_ALL)}>
        Manage Proposals
      </Button>
      <Button size="lg" onClick={() => navigate(PROPOSAL_HREFS.CREATE)}>
        Create a Proposal
      </Button>
    </div>
  );
}
