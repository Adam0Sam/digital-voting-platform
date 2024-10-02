import { UserActionLog, UserActions } from './types/log.type';

export type ActionFilter = Record<UserActionLog['action'], boolean>;
export default function constructActionFilter(
  defaultState = true,
): ActionFilter {
  return Object.values(UserActions).reduce(
    (acc, action) => {
      acc[action] = defaultState;
      return acc;
    },
    {} as Record<UserActionLog['action'], boolean>,
  );
}
