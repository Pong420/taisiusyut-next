import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@/config';

export const MongooseModule = _MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    mongoose.set('toJSON', {
      virtuals: true, // clone '_id' to 'id'
      versionKey: false // remove '__v',
    });

    return {
      uri: configService.get<string>('MONGODB_URI'),
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
  }
});
