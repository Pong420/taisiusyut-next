import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async () => {
          return UserSchema;
        }
      }
    ])
  ],
  exports: [UsersService],
  providers: [UsersService]
})
export class UsersModule {}
