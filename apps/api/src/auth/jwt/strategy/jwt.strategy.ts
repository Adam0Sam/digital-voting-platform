import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/config/interfaces';
import { JwtDto } from '../dto';
import { UserService } from 'src/user/user.service';
import { LoggerService } from 'src/logger/logger.service';
import { Request } from 'express';
import { User } from '@ambassador/user';
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
      // secretOrKeyProvider: (req, token, done) => {
      //   done(null, 'secret');
      // },
      secretOrKey: config.get('auth.jwt.publicKey'),
      // issuer: config.get('auth.jwt.issuer'),

      passReqToCallback: true,
    });
  }

  // passport calls this method even if the token is invalid, why?
  async validate(req: Request, payload: JwtDto) {
    const personalNames = splitFirstNames(payload.first_name);
    console.log('GRADE:', payload.grade);
    console.log('transformed grade:', toGrade(payload.grade));
    const user: User | null = await this.userService.findUser({
      personalNames,
      familyName: payload.last_name,
      grade: toGrade(payload.grade),
    });

    this.logger.logAction(Action.AUTH_ATTEMPT, {
      userId: user?.id,
      userAgent: req.headers['user-agent'],
    });

    if (!user) {
      const newUser = await this.userService.createUser({
        ...payload,
        personalNames,
        familyName: payload.last_name,
        grade: toGrade(payload.grade),
      });

      this.logger.logAction(Action.SIGNUP, {
        userId: newUser.id,
        userAgent: req.headers['user-agent'],
      });
      return newUser;
    }

    this.logger.logAction(Action.SIGNIN, {
      userId: user.id,
      userAgent: req.headers['user-agent'],
    });
    return user;
  }
}
