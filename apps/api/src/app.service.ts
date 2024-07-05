import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private auth: AuthService,
  ) {}

  async onModuleInit() {
    await this.prisma.cleanDb();
    await this.prisma.populateDatabase();
    const user = await this.auth.validateUser(['John', 'Michael'], 'Doe');
    console.log('User:', user);
  }
}
