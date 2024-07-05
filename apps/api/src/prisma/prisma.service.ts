import { Global, Injectable, OnModuleInit } from '@nestjs/common';
import { Grade, PrismaClient, User, UserRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDb() {
    await this.user.deleteMany();
  }

  async populateDatabase() {
    const userData: User[] = [
      {
        id: '1',
        personalNames: ['John', 'Michael'],
        lastName: 'Doe',
        grade: Grade.IA,
        roles: [UserRole.STUDENT],
      },
      {
        id: '2',
        personalNames: ['Jane', 'Anne'],
        lastName: 'Smith',
        grade: Grade.IB,
        roles: [UserRole.ADMIN],
      },
    ];

    for (const user of userData) {
      try {
        await this.user.create({
          data: user,
        });
        console.log(
          `User ${user.personalNames.join(' ')} ${user.lastName} created.`,
        );
      } catch (error) {
        console.error(
          `Error creating user ${user.personalNames.join(' ')} ${user.lastName}:`,
          error,
        );
      }
    }
  }
}
