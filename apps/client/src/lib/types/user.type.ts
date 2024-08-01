import {
  isKeyOfLiteralObj,
  isRoleType,
  isType,
  isTypeArray,
  WithValuesAsStrings,
} from './type-utils';

/**
 * The types of Grade, Role, ProposalManagerRole directly relate
 * to the the enums defined in the prisma schema file
 */

export const Grades = {
  IA: 'IA',
  IB: 'IB',
  IC: 'IC',
  ID: 'ID',
  IE: 'IE',
  IIA: 'IIA',
  IIB: 'IIB',
  IIC: 'IIC',
  IID: 'IID',
  IIE: 'IIE',
  IIIA: 'IIIA',
  IIIB: 'IIIB',
  IIIC: 'IIIC',
  IIID: 'IIID',
  TB1: 'TB1',
  IVA: 'IVA',
  IVB: 'IVB',
  IVC: 'IVC',
  IVD: 'IVD',
  TB2: 'TB2',
  NONE: 'NONE',
} as const;

export type Grade = keyof typeof Grades;

export const isGrade = (grade: unknown) => isKeyOfLiteralObj(grade, Grades);

export const UserRoles = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  PARENT: 'PARENT',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  GUEST: 'GUEST',
} as const;

export type UserRole = keyof typeof UserRoles;

export const isUserRole = (role: unknown) => isKeyOfLiteralObj(role, UserRoles);

export const ProposalManagerRoles = {
  OWNER: 'OWNER',
  REVIEWER: 'REVIEWER',
} as const;

export type ProposalManagerRole = keyof typeof ProposalManagerRoles;

export const isProposalManagerRole = (role: unknown) =>
  isKeyOfLiteralObj(role, ProposalManagerRoles);

export type User = {
  id: string;
  personalNames: string[];
  familyName: string;
  grade: Grade;
  roles: UserRole[];
};

export type StringifiedUser = WithValuesAsStrings<User>;

export function isUser(user: unknown): user is User {
  if (typeof user === 'object' && user !== null) {
    const { id, personalNames, familyName, grade, roles } = user as User;
    return (
      typeof id === 'string' &&
      Array.isArray(personalNames) &&
      personalNames.every(name => typeof name === 'string') &&
      typeof familyName === 'string' &&
      isGrade(grade) &&
      Array.isArray(roles) &&
      roles.every(role => typeof role === 'string')
    );
  }
  return false;
}

export const isUserArray = (items: unknown) => isTypeArray<User>(items, isUser);
