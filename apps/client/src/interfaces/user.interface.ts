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
}

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  GUEST = 'GUEST',
}

export interface User {
  id: string;
  personalNames: string[];
  familyName: string[];
  grade: Grade;
  roles: string[];
}
