import { Action } from '@ambassador';

export type LogMessage = {
  action: Action;
  info: {
    userId: string;
    proposalId?: string;
    userAgent?: string;
    message?: string;
  };
};
