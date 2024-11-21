import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/lib/auth/jwt/guard';
import { Roles } from 'src/lib/auth/rbac/decorator';
import { UserRolesGuard } from 'src/lib/auth/rbac/guard';
import { ActionLogService } from './action-log.service';
import { ZodValidationPipe } from 'src/lib/pipes';
import {
  UserRole,
  User,
  ActionFilter,
  ActionFilterSchema,
  Action,
} from '@ambassador';
import { GetUser } from 'src/lib/decorator';
import { LoggerService } from 'src/modules/logger/logger.service';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class ActionLogController {
  constructor(
    private actionLogService: ActionLogService,
    private logger: LoggerService,
  ) {}
  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':userId')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  getUserLogs(
    @Param('userId') userId: User['id'],
    @Query('pageSize') pageSize: number,
    @Query('page') page: number,
    @Query('actionFilter', new ZodValidationPipe(ActionFilterSchema, true))
    actionFilter: ActionFilter,
  ) {
    return this.actionLogService.getUserLogs(
      userId,
      pageSize,
      page,
      actionFilter,
    );
  }

  @UseGuards(UserRolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':userId/count')
  getUserLogsCount(
    @Param('userId') userId: User['id'],
    @Query('actionFilter', new ZodValidationPipe(ActionFilterSchema, true))
    actionFilter: ActionFilter,
  ) {
    return this.actionLogService.getUserLogsCount(userId, actionFilter);
  }

  @Post('signin')
  registerSigninLog(@GetUser('id') userId: User['id'], @Req() req: Request) {
    return this.logger.logAction({
      action: Action.SIGNIN,
      info: {
        userId: userId,
        userAgent: req.headers['user-agent'],
      },
    });
  }
}
