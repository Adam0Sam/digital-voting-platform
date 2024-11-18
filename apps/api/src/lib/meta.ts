import { Proposal, User } from '@ambassador';

export type MetaInfo = { userId: User['id']; proposalId: Proposal['id'] };
