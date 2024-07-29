import { Grade, isGrade, User } from '@/types';
import { StringifiedUser } from '../UserColumns';

const getNormalizedTableUsers: (
  users: Partial<StringifiedUser>[],
) => User[] = users => {
  const normalizedUsers = users.map(user => {
    if (!user.id || !user.personalNames || !user.familyName || !user.roles) {
      throw new Error(`Necessary info is missing are missing`);
    }

    const personalNames =
      user.personalNames.indexOf(' ') > -1
        ? user.personalNames.split(' ')
        : [user.personalNames];
    const familyName = user.familyName;
    const roles =
      user.roles.indexOf(' ') > -1 ? user.roles.split(' ') : [user.roles];
    //TODO: What does this mean and how do I fix it
    const grade = isGrade(user.grade) ? user.grade : Grade.NONE;

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
