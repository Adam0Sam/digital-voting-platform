import { Module } from '@nestjs/common';
import { ManagerRoleController } from './manager-role.controller';
import { ManagerRoleService } from './manager-role.service';

@Module({
  controllers: [ManagerRoleController],
  providers: [ManagerRoleService],
})
export class ManagerRoleModule {}
