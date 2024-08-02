import { Grade, UserRole } from '@prisma/client';

/**
 * @description
 * this method is necessary because, OAuth2 may return different first_name prop
 * depending on whether Tamo or MSTeams was used for authentication
 */
export function splitFirstNames(name: string) {
  if (name.includes(' ')) {
    return name.split(' ');
  } else {
    return name.match(/[A-Z][a-z]*/g);
  }
}

export function mapGrade(gradeString: string): Grade {
  let grade: Grade | undefined;
  if (gradeString.toUpperCase().startsWith('TB')) {
    grade = Grade[gradeString.toUpperCase().slice(0, 3)];
  } else {
    grade = Grade[gradeString.toUpperCase()];
  }
  if (!grade) {
    return Grade.NONE;
  }
  return grade;
}

export function mapUserRoles(roles: string[]): UserRole[] {
  return roles.map((roleString) => {
    const role: UserRole | undefined = UserRole[roleString.toUpperCase()];
    if (!role) {
      throw new Error(`Invalid role:${role}`);
    }
    return role;
  });
}
