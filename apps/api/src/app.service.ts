import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/interfaces';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService<AppConfig>,
  ) {}

  async onModuleInit() {
    await this.prisma.cleanDb();
    await this.prisma.populateDatabase();
    // const user = await this.auth.validateUser(['John', 'Michael'], 'Doe');
    console.log('Config', this.config.get('auth.jwt.publicKey'));
  }
}
