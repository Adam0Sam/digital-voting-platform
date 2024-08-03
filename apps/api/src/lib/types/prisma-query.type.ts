/**
 * TODO: Replace this type with prisma's typed query statements in the Prisma namespace
 * @link https://www.prisma.io/docs/orm/prisma-client/type-safety/prisma-validator
 * */

export type PrismaQuery<
  T extends string | number | symbol = string,
  K extends Record<string, any> = Record<string, any>,
> = Record<T, K>;
