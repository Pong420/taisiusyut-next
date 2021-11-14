import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config';
import { MongooseSerializerInterceptor } from '@/utils/mongoose-serializer.interceptor';
import { MongooseModule } from './modules/database';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthModule,
    MongooseModule,
    BookModule,
    MongooseSerializerInterceptor,
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 60 // seconds
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MongooseSerializerInterceptor
    }
  ]
})
export class AppModule {}
