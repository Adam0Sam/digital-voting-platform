// TODO: Think on this type's naming and consider if it is even necessary
export type PrismaQuery<
  T extends string | number | symbol = string,
  K extends Record<string, any> = Record<string, any>,
> = Record<T, K>;
