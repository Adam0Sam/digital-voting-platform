import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseObjectKeyPipe<T> implements PipeTransform {
  constructor(private readonly map: Record<string, T>) {}
  transform(value: string) {
    const mappedValue = this.map[value.toLowerCase()];
    if (!mappedValue) {
      throw new BadRequestException(`Invalid key: ${value}`);
    }
    return mappedValue;
  }
}
