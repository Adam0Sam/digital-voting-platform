import { Grades, User, UserDeep } from '@/lib/types';
import { TablifiedUser, TablifiedUserDeep } from '../table.types';

export function tablifyUser(user: User): TablifiedUser {
  return {
    id: user.id,
    personalNames: user.personalNames.join(' '),
    familyName: user.familyName,
    roles: user.roles.join(', '),
    grade: user.grade || Grades.NONE,
    email: user.email || '',
    active: user.active,
  };
}

export function tablifyUserDeep(user: UserDeep): TablifiedUserDeep {
  return {
    ...tablifyUser(user),
    managedProposals: user.managedProposals.length,
    votes: user.votes.length,
    authoredPermissions: user.authoredPermissions.length,
  };
}
