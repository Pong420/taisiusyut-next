import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService extends MongooseCRUDService<User, UserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  async create(createCatDto: CreateUserDto) {
    return super.create(createCatDto);
  }
}
