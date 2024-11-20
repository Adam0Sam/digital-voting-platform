import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@ambassador/user';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request['user'][data];
    }
    return request['user'];
  },
);
