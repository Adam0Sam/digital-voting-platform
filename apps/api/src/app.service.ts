import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
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
  }
}
