export * from './proposal.api';
export * from './user.api';
export * from './http-client';
export * from './error';

import { ManagerRoleApi } from './manager-role.api';
import { ProposalApi } from './proposal.api';
import { UserApi } from './user.api';
export const api = {
  proposals: new ProposalApi(),
  users: new UserApi(),
  managerRole: new ManagerRoleApi(),
};
