import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class JwtAuthService {
  constructor() {}

  signin(user: User) {
    return user;
  }
}
