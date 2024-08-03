import { ProposalManagerRole } from '@prisma/client';

export const VoterAgentRole = 'VOTER' as const;

export type ProposalAgentRole = typeof VoterAgentRole | ProposalManagerRole;
export const ProposalAgentRoles: ProposalAgentRole[] = [
  VoterAgentRole,
  ...Object.values(ProposalManagerRole),
];
