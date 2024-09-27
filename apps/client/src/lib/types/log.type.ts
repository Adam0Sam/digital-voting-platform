export type UserActionLog = {
  id: string;
  action: (typeof UserActions)[keyof typeof UserActions];
  userAgent?: string;
  message?: string;
  time: string;
  userId: string;
};

export const UserActions = {
  AUTH_ATTEMPT: 'AUTH_ATTEMPT',
  SIGNUP: 'SIGNUP',
  SIGNIN: 'SIGNIN',
  CREATE_PROPOSAL: 'CREATE_PROPOSAL',
  EDIT_PROPOSAL: 'EDIT_PROPOSAL',
  DELETE_PROPOSAL: 'DELETE_PROPOSAL',
  VOTE: 'VOTE',
  EDIT_VOTE: 'EDIT_VOTE',
  DELETE_VOTE: 'DELETE_VOTE',
} as const;
