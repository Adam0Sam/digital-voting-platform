export enum Grade {
  IA = 'IA',
  IB = 'IB',
  IC = 'IC',
  ID = 'ID',
  IE = 'IE',
  IIA = 'IIA',
  IIB = 'IIB',
  IIC = 'IIC',
  IID = 'IID',
  IIE = 'IIE',
  IIIA = 'IIIA',
  IIIB = 'IIIB',
  IIIC = 'IIIC',
  IIID = 'IIID',
  TB1 = 'TB1',
  IVA = 'IVA',
  IVB = 'IVB',
  IVC = 'IVC',
  IVD = 'IVD',
  TB2 = 'TB2',
  NONE = 'N/A',
}

export function isGrade(grade: unknown): grade is Grade {
  if (typeof grade === 'string') {
    return Object.values(Grade).includes(grade);
  }
  return false;
}

export const enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  GUEST = 'GUEST',
}

export type User = {
  id: string;
  personalNames: string[];
  familyName: string;
  grade?: Grade;
  roles: string[];
};

export function isUser(user: unknown): user is User {
  if (typeof user === 'object' && user !== null) {
    const { id, personalNames, familyName, grade, roles } = user as User;
    return (
      typeof id === 'string' &&
      Array.isArray(personalNames) &&
      personalNames.every(name => typeof name === 'string') &&
      typeof familyName === 'string' &&
      (grade === undefined || isGrade(grade)) &&
      Array.isArray(roles) &&
      roles.every(role => typeof role === 'string')
    );
  }
  return false;
}

export function isUserArray(users: unknown): users is User[] {
  if (Array.isArray(users)) {
    return users.every(user => isUser(user));
  }
  return false;
}
