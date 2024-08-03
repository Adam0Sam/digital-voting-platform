import { isGrade, isUserRoleArray, User } from '@/lib/types';
import { StringifiedUser } from '../UserColumns';

const getNormalizedTableUsers: (
  users: Partial<StringifiedUser>[],
) => User[] = users => {
  const normalizedUsers = users.map(user => {
    if (!user.id || !user.personalNames || !user.familyName || !user.roles) {
      throw new Error(
        `Necessary info is missing for user: ${JSON.stringify(user)}`,
      );
    }

    const personalNames =
      user.personalNames.indexOf(' ') > -1
        ? user.personalNames.split(' ')
        : [user.personalNames];
    const familyName = user.familyName;

    const stringifiedRoles =
      user.roles.indexOf(' ') > -1 ? user.roles.split(' ') : [user.roles];
    if (!isUserRoleArray(stringifiedRoles)) {
      throw new Error(
        `Invalid ${user.familyName} user roles: ${JSON.stringify(user.roles)}`,
      );
    }
    const roles = stringifiedRoles;

    if (!isGrade(user.grade)) {
      throw new Error(
        `Invalid ${user.familyName} user grade: ${JSON.stringify(user.grade)}`,
      );
    }
    const grade = user.grade;

    return {
      id: user.id,
      personalNames,
      familyName,
      roles,
      grade,
    };
  });
  return normalizedUsers;
};

export default getNormalizedTableUsers;