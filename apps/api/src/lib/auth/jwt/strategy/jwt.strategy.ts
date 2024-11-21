import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/lib/config/interfaces';
import { JwtDto } from '../dto';
import { UserService } from 'src/modules/user/user.service';
import { LoggerService } from 'src/modules/logger/logger.service';
import { Request } from 'express';
import { toUserRole, User } from '@ambassador/user';
import { Action } from '@ambassador/action-log';
import { toGrade } from '@ambassador/user/user-grade';

/**
 * @description
 * this method is necessary because, OAuth2 may return different first_name prop
 * depending on whether Tamo or MSTeams was used for authentication
 */
export function splitFirstNames(name: string) {
  if (name.includes(' ')) {
    return name.split(' ');
  } else {
    return name.match(/[A-Z][a-z]*/g);
  }
}
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService<AppConfig>,
    private userService: UserService,
    private logger: LoggerService,
  ) {
    super({
      // available options: https://github.com/mikenicholson/passport-jwt#configure-strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('auth.jwt.publicKey'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtDto): Promise<User> {
    const personalNames = splitFirstNames(payload.first_name);
    const familyName = payload.last_name;
    const grade = toGrade(payload.grade);
    const roles = payload.roles.map(toUserRole);
    console.log('Validating');
    const user: User | null = await this.userService.findUser({
      // @ts-expect-error idk
      personalNames,
      familyName,
      grade,
    });

    if (!user) {
      const newUserAccount = await this.userService.createUser({
        personalNames,
        familyName,
        grade,
        roles,
        email: null,
        active: true,
      });

      this.logger.logAction({
        action: Action.SIGNUP,
        info: {
          userId: newUserAccount.id,
          userAgent: req.headers['user-agent'],
        },
      });
    }

    return user;
  }
}
