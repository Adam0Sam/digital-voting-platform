import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UserQueryDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  personalNames: string[];
  @IsString()
  @IsNotEmpty()
  familyName: string;
}
