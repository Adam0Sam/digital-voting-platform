import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { AppConfig } from 'src/config/interfaces';
import { JwtDto } from '../dto';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService<AppConfig>,
    private authService: AuthService,
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
    const personalNames = this.authService.splitNames(payload.first_name);
    const user: User | null = await this.authService.findUser({
      personalNames,
      familyName: payload.last_name,
      grade: this.authService.mapGrade(payload.grade),
    });

    if (!user) {
      const newUser = await this.authService.createUser({
        ...payload,
        personalNames,
        familyName: payload.last_name,
        grade: this.authService.mapGrade(payload.grade),
      });
      return newUser;
    }
    return user;
  }
}
