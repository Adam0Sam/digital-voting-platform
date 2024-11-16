export const enum ArrayMembership {
  FIRST = 'FIRST_ONLY',
  SECOND = 'SECOND_ONLY',
  BOTH = 'BOTH',
}

type ExclusivityMap<T extends PropertyKey> = Record<T, ArrayMembership>;

export function getPrimitiveArrayExclusivityMap<T extends PropertyKey>(
  firstArray: T[],
  secondArray: T[],
) {
  const exclusivityMap: ExclusivityMap<T> = {} as ExclusivityMap<T>;

  for (const element of firstArray) {
    exclusivityMap[element] = ArrayMembership.FIRST;
  }

  for (const element of secondArray) {
    exclusivityMap[element] = exclusivityMap[element]
      ? ArrayMembership.BOTH
      : ArrayMembership.SECOND;
  }

  return exclusivityMap;
}
