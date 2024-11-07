export * from './proposal.api';
export * from './user.api';
export * from './http-client';
export * from './error';

import { AdminApi } from './admin.api';
import { LoggerApi } from './logger.api';
import { ManagerRoleApi } from './manager-role.api';
import { ProposalApi } from './proposal.api';
import { UserApi } from './user.api';
import { VoteApi } from './vote.api';
export const api = {
  proposals: new ProposalApi(),
  users: new UserApi(),
  managerRole: new ManagerRoleApi(),
  vote: new VoteApi(),
  admin: new AdminApi(),
  logger: new LoggerApi(),
};
