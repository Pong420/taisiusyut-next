import 'reflect-metadata';
import http from 'http';
import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger } from '@nestjs/common';
import { NextApiHandler } from 'next';
import { AppModule } from './app.module';
import { setup } from './setup';
import { BookService } from './modules/book/book.service';
import { MongooseSerializerInterceptor } from './utils/mongoose-serializer.interceptor';

class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  get value(): T | null {
    return (global[this.sym] as T) || null;
  }

  set value(value: T | null) {
    (global as any)[this.sym] = value;
  }
}

const app = new GlobalRef<INestApplication>('app');
const appPromise = new GlobalRef<Promise<INestApplication>>('appPromise');

export async function getApp() {
  if (app.value) {
    Logger.debug('app exists');
    return app.value;
  }

  if (!appPromise.value) {
    appPromise.value = new Promise<INestApplication>(async resolve => {
      Logger.debug('creating app');
      const appInCreation = await NestFactory.create(AppModule, { logger: ['warn', 'error', 'debug'] });
      appInCreation.setGlobalPrefix('api');
      setup(appInCreation);
      Logger.debug('intializing app');
      await appInCreation.init();
      Logger.debug('app created');
      resolve(appInCreation);
    }).catch(error => {
      Logger.error(error);
      throw error;
    });
  }

  Logger.debug('appPromise exists');

  app.value = await appPromise.value;

  Logger.debug('appPromise resolve');

  return app.value;
}

export async function getListener() {
  const app = await getApp();
  const server: http.Server = app.getHttpServer();
  const [listener] = server.listeners('request') as NextApiHandler[];
  return listener;
}

export async function getBookService() {
  const app = await getApp();
  return app.get(BookService);
}

export async function getSerializer() {
  const app = await getApp();
  return app.get(MongooseSerializerInterceptor);
}
