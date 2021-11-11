import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { Catch, ArgumentsHost, HttpStatus, ExceptionFilter } from '@nestjs/common';

export function handleMongoError(exception: unknown): [keyof typeof HttpStatus, string] | undefined {
  if (exception instanceof MongooseError.CastError) {
    if (exception.path === '_id') {
      return ['BAD_REQUEST', 'Incorrect id'];
    }
    return [
      'BAD_REQUEST',
      `Cast to '${exception.kind}' failed for value '${exception.value}' at path '${exception.path}'`
    ];
  }

  if (exception instanceof MongoError) {
    switch (exception.code) {
      case 11000:
        return [
          'BAD_REQUEST',
          'keyValue' in exception
            ? `Duplicated ${Object.keys((exception as any).keyValue).join(',')}`
            : exception.message
        ];
    }
  }
}

@Catch(MongoError, MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const [type, message] = handleMongoError(exception) || [];

    if (typeof type !== 'undefined') {
      const status = HttpStatus[type];
      response.status(status).send({
        statusCode: status,
        message
      });
    }
  }
}
