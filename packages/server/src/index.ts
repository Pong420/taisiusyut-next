import 'reflect-metadata';
import http from 'http';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { NextApiHandler } from 'next';
import { AppModule } from './app.module';
import { setup } from './setup';

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
