import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/modules/users/users.module';
import { ConfigModule, ConfigService } from '@/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenService } from './refresh-token.service';
import { JwtStrategy, LocalStrategy } from './strategy';
import { RefreshToken, RefreshTokenSchema } from './schemas/refreshToken.schema';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema
      }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<number>('JWT_TOKEN_EXPIRES_IN_MINUTES') + 'm'
          }
        };
      },
      inject: [ConfigService]
    })
  ],
  exports: [AuthService, RefreshTokenService],
  providers: [AuthService, RefreshTokenService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
