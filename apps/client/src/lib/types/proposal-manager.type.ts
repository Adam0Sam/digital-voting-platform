import { User } from './user.type';

export type ProposalManagerDto = {
  user: User;
  role: ProposalManagerRole;
};

export type ProposalManagerRole = ProposalManagerRoleDto & {
  id: string;
};

export type ProposalManagerRoleDto = {
  roleName: string;
  description?: string;
  permissions: ManagerPermissionsDto;
};

export const ManagerPermissionsList = [
  'canEditTitle',
  'canEditDescription',
  'canEditDates',
  'canEditStatus',
  'canEditVisibility',
  'canEditVotes',
  'canEditManagers',
  'canEditChoices',
  'canEditChoiceCount',
] as const;

export type ManagerPermissionsDto = {
  [key in (typeof ManagerPermissionsList)[number]]: boolean;
};
