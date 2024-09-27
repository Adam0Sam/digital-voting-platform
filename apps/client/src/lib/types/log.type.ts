export const USER_ACTIONS = [
  'AUTH_ATTEMPT',
  'SIGNUP',
  'SIGNIN',
  'CREATE_PROPOSAL',
  'EDIT_PROPOSAL',
  'DELETE_PROPOSAL',
  'VOTE',
  'EDIT_VOTE',
  'DELETE_VOTE',
] as const;

export type UserActionLog = {
  id: string;
  action: (typeof USER_ACTIONS)[number];
  userAgent?: string;
  message?: string;
  timestamp: Date;
  userId: string;
};
