import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/guard';
import { Roles } from 'src/auth/rbac/decorator';
import { UserRolesGuard } from 'src/auth/rbac/guard';
import { ActionLogService } from './action-log.service';
import { ZodValidationPipe } from 'src/pipes';
import { ActionFilterDto, ActionFilterDtoSchema } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('logs')
export class ActionLogController {
  constructor(private actionLogService: ActionLogService) {}
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
    @Query('actionFilter', new ZodValidationPipe(ActionFilterDtoSchema, true))
    actionFilter: ActionFilterDto,
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
    @Query('actionFilter', new ZodValidationPipe(ActionFilterDtoSchema, true))
    actionFilter: ActionFilterDto,
  ) {
    return this.actionLogService.getUserLogsCount(userId, actionFilter);
  }
}
