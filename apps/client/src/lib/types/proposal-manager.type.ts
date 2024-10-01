import { User } from './user.type';

export type ProposalManager = {
  id: string;
  userId: string;
  role: ProposalManagerRole;
};

export type ProposalManagerListDto = {
  users: User[];
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
  'canDeleteVotes',
  'canCreateVotes',
  'canEditManagers',
  'canEditVoteChoices',
  'canEditAvailableChoices',
  'canEditChoiceCount',
  'canEditUserPattern',
] as const;

export type ManagerPermissionsDto = {
  [key in (typeof ManagerPermissionsList)[number]]: boolean;
};
