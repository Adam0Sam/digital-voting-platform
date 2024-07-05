import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authorization = request.headers['authorization'];

//     if (!authorization) {
//       return false;
//     }

//     const [bearer, token] = authorization.split(' ');

//     if (bearer !== 'Bearer' || !token) {
//       return false;
//     }

//     try {
//       console.log('--------------------TOKEN--------------------', token);
//       const payload = await this.jwtService.verifyAsync(token, {
//         algorithms: ['RS256'],
//         ignoreExpiration: true,
//         publicKey:
//           '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwQRARAB58MFB7LYUk6kE\nFr8c4eORlmhx3Bf5Z4VqgYuqju3cdz9GRAgFexzgSYT5lN1WxMn1QsXzR7VPfWpr 3AqG6kdwMpXVJ7elWhYSvmNTnD/Y6BLPMb30fAWsYfe3Zdq3XR2ob3eIPCvyr5UG\n4OTdaI/wWnMpG89MfqfCX/pDuRmFrz0yRMpp25aVH1eP5Wqa2zdUOypArgMwy7ov gncNIW005IMiHXbEww4PXb2ZnYk1RqfyOxpewY++4+ox8Z4NqRvZV54nNph7C8cA\nCJgu9/YBGZ9pfwbMWDZ1KoAQwLJKpzGtExr/s9HCfN6omG32V2iCFCdfeQdQyirJ\nvQIDAQAB\n-----END PUBLIC KEY-----',
//       });
//       // request['user'] = payload;
//     } catch (error) {
//       console.error('--------------------ERROR--------------------', error);
//       throw new UnauthorizedException();
//     }
//     return true;
//   }
// }
