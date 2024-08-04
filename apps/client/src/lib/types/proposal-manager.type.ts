import { User } from './user.type';

export type ProposalManagerDto = {
  user: User;
  role: ProposalManagerRoleDto;
};

export type ProposalManagerRoleDto = {
  roleName: string;
  permissions: ManagerPermissionsDto;
};

export type ManagerPermissionsDto = {
  canEditTitle: boolean;
  canEditDescription: boolean;
  canEditDates: boolean;
  canEditStatus: boolean;
  canEditVisibility: boolean;
  canEditVotes: boolean;
  canEditManagers: boolean;
  canEditChoices: boolean;
  canEditChoiceCount: boolean;
};
