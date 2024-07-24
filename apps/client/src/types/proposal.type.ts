import { User } from './user.interface';

export type ProposalData = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  owners: User[];
  reviewers?: User[];
};
