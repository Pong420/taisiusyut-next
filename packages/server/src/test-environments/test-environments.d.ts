import '@jest/types';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

declare global {
  let app: INestApplication;
  let request: supertest.SuperTest<supertest.Test>;
}

declare module '@jest/types' {
  declare namespace Global {
    export interface Global {
      app: INestApplication;
      request: supertest.SuperTest<supertest.Test>;
    }
  }
}
