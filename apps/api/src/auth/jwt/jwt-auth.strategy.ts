import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/config/interfaces';
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService<AppConfig>) {
    super({
      // available options: https://github.com/mikenicholson/passport-jwt#configure-strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: config.get('auth.jwt.publicKey'),
    });
  }
  async validate(payload: any) {
    console.log('Payload', payload);
    return payload;
  }
}
