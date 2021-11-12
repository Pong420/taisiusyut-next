import 'reflect-metadata';
import http from 'http';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { NextApiHandler } from 'next';
import { AppModule } from './app.module';
import { setup } from './setup';
import { BookService } from './modules/book/book.service';
import { MongooseSerializerInterceptor } from './utils/mongoose-serializer.interceptor';

let app: INestApplication;
let appPromise: Promise<INestApplication>;

export async function getApp() {
  if (app) return app;

  if (!appPromise) {
    appPromise = new Promise<INestApplication>(async resolve => {
      const appInCreation = await NestFactory.create(AppModule);
      appInCreation.setGlobalPrefix('api');
      setup(appInCreation);
      await appInCreation.init();
      resolve(appInCreation);
    });
  }

  app = await appPromise;

  return app;
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
