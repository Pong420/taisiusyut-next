import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config';
import { MongooseSerializerInterceptor } from '@/utils/mongoose-serializer.interceptor';
import { MongooseModule } from './modules/database';

@Module({
  imports: [ConfigModule, UsersModule, AuthModule, MongooseModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseSerializerInterceptor
    }
  ]
})
export class AppModule {}
