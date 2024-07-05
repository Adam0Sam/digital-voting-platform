import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(personalNames: string[], lastName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        personalNames_lastName: {
          personalNames,
          lastName,
        },
      },
    });

    return user;
  }

  async signIn(id_token: string) {
    console.log('Signing in user:', id_token);
    // return user;
  }

  // async getPublicKey() {
  //   try {
  //     const response = await fetch(URI.PUBLIC_KEY_ENDPOINT);
  //     return await response.text();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
}
