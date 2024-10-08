import { useState } from 'react';
import VoterCard from '@/components/proposal/voter/VoterCard';
import { LOADER_IDS, useLoadedData } from '@/lib/loaders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function VoterLandingPage() {
  const proposals = useLoadedData(LOADER_IDS.VOTER_PROPOSALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('startDate');

  const filteredProposals = proposals.filter(proposal =>
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (sortBy === 'startDate') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortBy === 'endDate') {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    }
    return 0;
  });

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Available Proposals
      </h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search proposals where you can vote..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-400" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="endDate">End Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedProposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            No proposals available
          </h2>
          <p className="text-muted-foreground">
            There are currently no proposals matching your search criteria.
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 [grid-auto-rows:max-content] sm:grid-cols-2 lg:grid-cols-3">
          {sortedProposals.map(proposal => (
            <VoterCard
              key={proposal.id}
              proposalData={proposal}
              voteData={proposal.votes[0]}
              className="h-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
