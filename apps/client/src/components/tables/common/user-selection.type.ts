import { Grade } from '@/types';

export type UserSelectionRow = {
  personalNames: string;
  familyName: string;
  grade?: Grade;
  roles: string[];
};
