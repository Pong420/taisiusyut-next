import { Document, Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';

export abstract class MongooseCRUDService<T, D extends T & Document = T & Document> {
  constructor(protected readonly model: Model<D>) {
    this.model = model;
  }

  async create(createDto: Partial<Omit<D, '_id' | 'id' | 'toJSON'>>) {
    return this.model.create(createDto);
  }

  async delete(filter: FilterQuery<D>): Promise<void> {
    await this.model.deleteOne(filter);
  }

  async deleteMany(filter: FilterQuery<D>): Promise<void> {
    await this.model.deleteMany(filter);
  }

  async findOneAndUpdate(filter?: FilterQuery<D>, update?: UpdateQuery<D>, options?: QueryOptions | null) {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      omitUndefined: true,
      ...options
    });
  }

  updateOne(filter: FilterQuery<D>, update: UpdateQuery<D>, options: QueryOptions = {}) {
    return this.model.updateOne(filter, update, {
      runValidators: true,
      setDefaultsOnInsert: true,
      omitUndefined: true,
      ...options
    });
  }

  updateMany(filter: FilterQuery<D>, update: UpdateQuery<D>, options: QueryOptions = {}) {
    return this.model.updateMany(filter, update, options);
  }

  async findOne(filter: FilterQuery<D>, options: QueryOptions = {}, projection: any = ''): Promise<D | null> {
    return this.model.findOne(filter, projection, options);
  }

  async find(filter: FilterQuery<D> = {}, projection: any | null = null, options: QueryOptions = {}): Promise<D[]> {
    return this.model.find(filter, projection, options);
  }

  exists(filter: FilterQuery<D>): Promise<boolean> {
    return this.model.exists(filter);
  }

  async clear(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new InternalServerErrorException(`You are trying to clear production database`);
    }
    await this.model.deleteMany({});
  }

  async countDocuments(filter: FilterQuery<D> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
