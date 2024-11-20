import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseStringLiteral<T extends string> implements PipeTransform {
  constructor(private readonly stringLiterals: T[]) {}
  transform(value: string) {
    const indexedLiterals = this.stringLiterals.map((literal, index) => ({
      value: literal.toLowerCase(),
      index,
    }));
    const matchedLiteral = indexedLiterals.find(
      (literal) => literal.value === value.toLowerCase(),
    );
    if (!matchedLiteral) {
      throw new BadRequestException(`Invalid key: ${value}`);
    }
    return this.stringLiterals[matchedLiteral.index];
  }
}
