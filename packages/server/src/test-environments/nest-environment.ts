import mongoose from 'mongoose';
import supertest from 'supertest';
import NodeEnvironment from 'jest-environment-node';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '@/app.module';
import { setup } from '@/setup';

export default class NestNodeEnvironment extends NodeEnvironment {
  mongod: MongoMemoryServer;

  async setup(): Promise<void> {
    await super.setup();

    try {
      this.mongod = await MongoMemoryServer.create();

      process.env.MONGODB_URI = `${this.mongod.getUri()}test`;

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
      }).compile();

      const app = moduleFixture.createNestApplication();

      setup(app);

      await app.init();

      this.global.app = app;
      this.global.request = supertest(app.getHttpServer());
    } catch (error) {
      await mongoose.connection.close();
      await this.mongod.stop();
    }
  }

  async teardown(): Promise<void> {
    await this.global.app.close();
    await mongoose.connection.close();
    await this.mongod.stop();
    await super.teardown();
  }
}
