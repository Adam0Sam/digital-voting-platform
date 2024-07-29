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

export type ProposalData = {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  owners: User[];
  reviewers?: User[];
  resolutionValues: ResolutionValue[];
  voters: User[];
};
