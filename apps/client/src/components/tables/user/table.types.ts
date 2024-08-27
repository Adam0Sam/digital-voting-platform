import { StringifiedUser } from '@/lib/types';

export type TableBoolean = {
  isBoolean: boolean;
  value: boolean;
};

export function IsTableBoolean(item: unknown): item is TableBoolean {
  return (
    typeof item === 'object' &&
    item !== null &&
    'isBoolean' in item &&
    'value' in item
  );
}

export type TablifiedUser = Omit<StringifiedUser, 'active'> & {
  active: TableBoolean;
};

export type TablifiedUserDeep = TablifiedUser & {
  managedProposals: number;
  votesResolved: number;
};
