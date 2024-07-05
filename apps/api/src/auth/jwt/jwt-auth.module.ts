import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from 'src/config/interfaces';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    PassportModule,
    // JwtModule.registerAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     publicKey:
    //       '-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwQRARAB58MFB7LYUk6kE Fr8c4eORlmhx3Bf5Z4VqgYuqju3cdz9GRAgFexzgSYT5lN1WxMn1QsXzR7VPfWpr 3AqG6kdwMpXVJ7elWhYSvmNTnD/Y6BLPMb30fAWsYfe3Zdq3XR2ob3eIPCvyr5UG 4OTdaI/wWnMpG89MfqfCX/pDuRmFrz0yRMpp25aVH1eP5Wqa2zdUOypArgMwy7ov gncNIW005IMiHXbEww4PXb2ZnYk1RqfyOxpewY++4+ox8Z4NqRvZV54nNph7C8cA CJgu9/YBGZ9pfwbMWDZ1KoAQwLJKpzGtExr/s9HCfN6omG32V2iCFCdfeQdQyirJ vQIDAQAB -----END PUBLIC KEY-----',
    //     signOptions: { expiresIn: '1d' },
    //   }),
    // }),
    JwtModule.register({
      global: true,
      publicKey:
        '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwQRARAB58MFB7LYUk6kE\nFr8c4eORlmhx3Bf5Z4VqgYuqju3cdz9GRAgFexzgSYT5lN1WxMn1QsXzR7VPfWpr 3AqG6kdwMpXVJ7elWhYSvmNTnD/Y6BLPMb30fAWsYfe3Zdq3XR2ob3eIPCvyr5UG\n4OTdaI/wWnMpG89MfqfCX/pDuRmFrz0yRMpp25aVH1eP5Wqa2zdUOypArgMwy7ov gncNIW005IMiHXbEww4PXb2ZnYk1RqfyOxpewY++4+ox8Z4NqRvZV54nNph7C8cA\nCJgu9/YBGZ9pfwbMWDZ1KoAQwLJKpzGtExr/s9HCfN6omG32V2iCFCdfeQdQyirJ\nvQIDAQAB\n-----END PUBLIC KEY-----',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
