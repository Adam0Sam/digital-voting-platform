import {
  ProposalManager,
  ProposalManagerListDto,
} from './proposal-manager.type';
import { User } from './user.type';
import {
  isKeyOfStringLiteralObj,
  isType,
  isTypeArray,
} from './utils/type-validators';
import { Vote } from './vote.type';

export type ProposalChoice = ProposalChoiceDto & { id: string };

export type Proposal = Omit<ProposalDto, 'choices' | 'voters' | 'managers'> & {
  id: string;
} & {
  choices: ProposalChoice[];
  votes: Vote[];
  managers: ProposalManager[];
};

export type ProposalDto = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: ProposalStatus;
  visibility: ProposalVisibility;

  managers: ProposalManagerListDto[];
  voters: User[];

  choices: ProposalChoiceDto[];
  choiceCount: number;
};

export type ProposalChoiceDto = {
  value: string;
  description?: string;
};

export const isProposalChoiceDto = (item: unknown) =>
  isType<ProposalChoiceDto>(item, item => {
    if (typeof item !== 'object') return false;
    if (item === null) return false;
    // TODO: How to fix this?
    const { value, description } = item as ProposalChoiceDto;
    return (
      typeof value === 'string' &&
      (description === undefined || typeof description === 'string')
    );
  });

export const isProposalChoiceDtoArray = (item: unknown) =>
  isTypeArray(item, isProposalChoiceDto);

export const ProposalVisibilityOptions = {
  PUBLIC: 'PUBLIC',
  AGENT_ONLY: 'AGENT_ONLY',
  MANAGER_ONLY: 'MANAGER_ONLY',
} as const;

export type ProposalVisibility = keyof typeof ProposalVisibilityOptions;

export const isProposalVisibility = (item: unknown) =>
  isKeyOfStringLiteralObj(item, ProposalVisibilityOptions);

export const ProposalStatusOptions = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  RESOLVED: 'RESOLVED',
  ABORTED: 'ABORTED',
} as const;

export type ProposalStatus = keyof typeof ProposalStatusOptions;

export const isProposalStatus = (item: unknown) =>
  isKeyOfStringLiteralObj(item, ProposalStatusOptions);
