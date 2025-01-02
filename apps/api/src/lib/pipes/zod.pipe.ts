import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private isStringified?: boolean,
  ) {}

  transform(value: unknown) {
    try {
      if (this.isStringified) {
        value = JSON.parse(value as string);
      }
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
