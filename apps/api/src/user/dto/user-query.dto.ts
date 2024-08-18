import { Grade } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsEnum,
} from 'class-validator';
import { z } from 'zod';
// TODO: Is class-validator bundled with nestjs by default?
export class UserQueryDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  personalNames: string[];
  @IsString()
  @IsNotEmpty()
  familyName: string;
  @IsEnum(Grade)
  grade: Grade;
}

export const UserEmailSchema = z.string().email();
