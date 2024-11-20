import { NIL_GRADE, User, UserWithRelations } from '@ambassador';
import { TablifiedUser, TablifiedUserDeep } from '../table.types';

export function tablifyUser(user: User): TablifiedUser {
  return {
    id: user.id,
    personalNames: user.personalNames.join(' '),
    familyName: user.familyName,
    roles: user.roles.join(', '),
    grade: user.grade || NIL_GRADE,
    email: user.email || '',
    active: user.active,
  };
}

export function tablifyUserDeep(user: UserWithRelations): TablifiedUserDeep {
  console.log('user', user);

  return {
    ...tablifyUser(user),
    managedProposals: user.managedProposals.length,
    votes: user.votes.length,
    authoredPermissions: user.authoredPermissions.length,
  };
}
