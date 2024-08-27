import { User, UserDeep, VoteStatusOptions } from '@/lib/types';
import { TablifiedUser, TablifiedUserDeep } from '../table.types';

export function tablifyUser(user: User): TablifiedUser {
  return {
    id: user.id,
    personalNames: user.personalNames.join(' '),
    familyName: user.familyName,
    roles: user.roles.join(', '),
    grade: user.grade,
    email: user.email || '',
    active: { value: user.active, isBoolean: true },
  };
}

export function tablifyUserDeep(user: UserDeep): TablifiedUserDeep {
  const votesResolved = user.votes.filter(
    vote => vote.status === VoteStatusOptions.RESOLVED,
  ).length;
  return {
    ...tablifyUser(user),
    managedProposals: user.managedProposals.length,
    votesResolved,
  };
}
