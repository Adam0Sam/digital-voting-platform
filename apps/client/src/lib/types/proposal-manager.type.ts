import { User } from './user.type';

export type ProposalManagerDto = {
  user: User;
  role: ProposalManagerRoleDto;
};

export type ProposalManagerRoleDto = {
  roleName: string;
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
