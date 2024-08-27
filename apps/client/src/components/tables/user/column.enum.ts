export enum UserSelectionColumn {
  PersonalNames = 'personalNames',
  FamilyName = 'familyName',
  Roles = 'roles',
  Grade = 'grade',
  Email = 'email',
  Active = 'active',
}

enum _UserDeepExclusiveSelectionColumn {
  ManagedProposals = 'managedProposals',
  VotesResolved = 'votesResolved',
}

export const UserDeepSelectionColumns = {
  ...UserSelectionColumn,
  ..._UserDeepExclusiveSelectionColumn,
};
