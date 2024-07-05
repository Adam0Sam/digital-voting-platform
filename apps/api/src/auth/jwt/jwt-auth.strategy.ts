import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/config/interfaces';
@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      // available options: https://github.com/mikenicholson/passport-jwt#configure-strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwQRARAB58MFB7LYUk6kE\nFr8c4eORlmhx3Bf5Z4VqgYuqju3cdz9GRAgFexzgSYT5lN1WxMn1QsXzR7VPfWpr 3AqG6kdwMpXVJ7elWhYSvmNTnD/Y6BLPMb30fAWsYfe3Zdq3XR2ob3eIPCvyr5UG\n4OTdaI/wWnMpG89MfqfCX/pDuRmFrz0yRMpp25aVH1eP5Wqa2zdUOypArgMwy7ov gncNIW005IMiHXbEww4PXb2ZnYk1RqfyOxpewY++4+ox8Z4NqRvZV54nNph7C8cA\nCJgu9/YBGZ9pfwbMWDZ1KoAQwLJKpzGtExr/s9HCfN6omG32V2iCFCdfeQdQyirJ\nvQIDAQAB\n-----END PUBLIC KEY-----',
    });
  }
  async validate(payload: any) {
    return payload;
  }
}
