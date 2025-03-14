import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
})
export class AdminModule {}
