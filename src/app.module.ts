import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [UsersModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
