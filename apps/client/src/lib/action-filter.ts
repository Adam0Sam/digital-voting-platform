import { ActionLogEntry, Actions } from '@ambassador';

export type ActionFilter = Record<ActionLogEntry['action'], boolean>;
export default function constructActionFilter(
  defaultState = true,
): ActionFilter {
  return Actions.reduce(
    (acc, action) => {
      acc[action] = defaultState;
      return acc;
    },
    {} as Record<ActionLogEntry['action'], boolean>,
  );
}
