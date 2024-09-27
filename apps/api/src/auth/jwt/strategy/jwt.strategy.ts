import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User, UserActions } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/config/interfaces';
import { JwtDto } from '../dto';
import { UserService } from 'src/user/user.service';
import { mapGrade, splitFirstNames } from 'src/user/utils';
import { LoggerService } from 'src/logger/logger.service';
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService<AppConfig>,
    private userService: UserService,
    private logger: LoggerService,
  ) {
    console.log('JWT AUTH CONFIG', config.get('auth.jwt.publicKey'));
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
    console.log('verify token', payload);
    const personalNames = splitFirstNames(payload.first_name);
    const user: User | null = await this.userService.findUser({
      personalNames,
      familyName: payload.last_name,
      grade: mapGrade(payload.grade),
    });

    this.logger.logAction(UserActions.AUTH_ATTEMPT, {
      userId: user?.id,
      userAgent: req.headers['user-agent'],
    });

    if (!user) {
      const newUser = await this.userService.createUser({
        ...payload,
        personalNames,
        familyName: payload.last_name,
        grade: mapGrade(payload.grade),
      });

      this.logger.logAction(UserActions.SIGNUP, {
        userId: newUser.id,
        userAgent: req.headers['user-agent'],
      });
      return newUser;
    }

    this.logger.logAction(UserActions.SIGNIN, {
      userId: user.id,
      userAgent: req.headers['user-agent'],
    });
    return user;
  }
}
