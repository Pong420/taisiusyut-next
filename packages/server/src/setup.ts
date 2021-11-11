import { ValidationPipe, INestApplication } from '@nestjs/common';
import { MongooseExceptionFilter } from '@/utils/mongoose-exception-filter';

export function setup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        exposeUnsetFields: false,
        excludePrefixes: ['$'] // for mongo operator
      }
    })
  );

  app.useGlobalFilters(new MongooseExceptionFilter());
}
