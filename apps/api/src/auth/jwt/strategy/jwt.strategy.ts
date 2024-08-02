import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/config/interfaces';
import { JwtDto } from '../dto';
import { UserService } from 'src/user/user.service';
import { mapGrade, splitFirstNames } from 'src/user/utils';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService<AppConfig>,
    private userService: UserService,
  ) {
    super({
      // available options: https://github.com/mikenicholson/passport-jwt#configure-strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('auth.jwt.publicKey'),
      issuer: config.get('auth.jwt.issuer'),
    });
  }

  // passport calls this method even if the token is invalid, why?
  async validate(payload: JwtDto) {
    const personalNames = splitFirstNames(payload.first_name);
    const user: User | null = await this.userService.findUser({
      personalNames,
      familyName: payload.last_name,
      grade: mapGrade(payload.grade),
    });

    if (!user) {
      console.log('User not found, creating new user');
      const newUser = await this.userService.createUser({
        ...payload,
        personalNames,
        familyName: payload.last_name,
        grade: mapGrade(payload.grade),
      });
      return newUser;
    }
    console.log('User found');
    return user;
  }
}
