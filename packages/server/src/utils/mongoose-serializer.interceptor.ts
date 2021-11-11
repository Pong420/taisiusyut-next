import { isObject } from 'class-validator';
import { ClassTransformOptions } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Model } from 'mongoose';
import {
  Type,
  Injectable,
  PlainLiteralObject,
  ExecutionContext,
  CallHandler,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { CLASS_SERIALIZER_OPTIONS } from '@nestjs/common/serializer/class-serializer.constants';

type Res = PlainLiteralObject | Array<PlainLiteralObject>;

@Injectable()
export class MongooseSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextOptions = this.getContextOptions(context);

    const options = {
      ...this.defaultOptions,
      ...contextOptions
    };

    return next.handle().pipe(
      map((res: Res) =>
        this.serialize(res, {
          ...options,
          exposeUnsetFields: false,
          // remove _id field
          excludePrefixes: ['_', ...(options.excludePrefixes || [])]
        })
      )
    );
  }

  serialize(response: Res, options: ClassTransformOptions): PlainLiteralObject | PlainLiteralObject[] {
    if (isObject(response) && 'data' in response && 'total' in response) {
      return {
        ...response,
        data: response.data.map((item: PlainLiteralObject) => this.transformToPlain(item, options))
      };
    }

    return super.serialize(response, options);
  }

  transformToPlain(plainOrClass: any, options: ClassTransformOptions): PlainLiteralObject {
    if (plainOrClass instanceof Model) {
      plainOrClass = plainOrClass.toJSON();
    }

    const plainObject = super.transformToPlain(plainOrClass, options);

    // transform timestamp to number for NextJS
    if (plainObject.createdAt instanceof Date) {
      plainObject.createdAt = plainObject.createdAt.getTime();
    }

    if (plainObject.updatedAt instanceof Date) {
      plainObject.updatedAt = plainObject.updatedAt.getTime();
    }

    return plainObject;
  }

  getContextOptions(context: ExecutionContext): ClassTransformOptions | undefined {
    return this._reflectSerializeMetadata(context.getHandler()) || this._reflectSerializeMetadata(context.getClass());
  }

  _reflectSerializeMetadata(
    // eslint-disable-next-line @typescript-eslint/ban-types
    obj: Function | Type<any>
  ): ClassTransformOptions | undefined {
    return this.reflector.get(CLASS_SERIALIZER_OPTIONS, obj);
  }
}
