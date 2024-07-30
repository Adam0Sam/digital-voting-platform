import { User } from './user.type';

export type ResolutionValue = { value: string; description?: string };

export function isResolutionValue(item: unknown): item is ResolutionValue {
  if (typeof item === 'object' && item !== null) {
    const { value, description } = item as ResolutionValue;
    return (
      typeof value === 'string' &&
      (description === undefined || typeof description === 'string')
    );
  }
  return false;
}

export function isResolutionValueArray(
  items: unknown,
): items is ResolutionValue[] {
  if (Array.isArray(items)) {
    return items.every(item => isResolutionValue(item));
  }
  return false;
}

export type ProposalDto = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  owners: User[];
  reviewers?: User[];
  resolutionValues: ResolutionValue[];
  voters: User[];
  visibility: ProposalVisibility;
  status: ProposalStatus;
};

export enum ProposalVisibility {
  PUBLIC = 'PUBLIC',
  RESTRICTED = 'RESTRICTED',
  MANAGER_ONLY = 'MANAGER_ONLY',
}

export function isProposalVisibility(
  item: unknown,
): item is ProposalVisibility {
  return Object.values(ProposalVisibility).includes(item as ProposalVisibility);
}

export enum ProposalStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  ABORTED = 'ABORTED',
}

export function isProposalStatus(item: unknown): item is ProposalStatus {
  return Object.values(ProposalStatus).includes(item as ProposalStatus);
}
