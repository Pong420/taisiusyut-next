import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@/config';
import { RefreshToken, RefreshTokenDocument } from './schemas/refreshToken.schema';
import { MongooseCRUDService } from '@/utils/mongoose-crud.service';

export const REFRESH_TOKEN_COOKIES = 'taisiusyut_refresh_token';

export interface CookieSerializeOptions {
  domain?: string;
  encode?(val: string): string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  secure?: boolean;
  signed?: boolean;
}

@Injectable()
export class RefreshTokenService extends MongooseCRUDService<RefreshToken> implements OnModuleInit {
  protected expireMiniues: number;

  constructor(
    @InjectModel(RefreshToken.name) refreshTokenModel: Model<RefreshTokenDocument>,
    configService: ConfigService
  ) {
    super(refreshTokenModel);
    this.expireMiniues = Number(configService.get('REFRESH_TOKEN_EXPIRES_IN_MINUTES', 0));
  }

  async onModuleInit() {
    const index: keyof RefreshToken = 'updatedAt';
    const num = 1;
    try {
      await this.model.collection.dropIndex(`${index}_${num}`);
    } catch (error) {}
    await this.model.collection.createIndex(
      { [index]: num },
      {
        expireAfterSeconds: this.expireMiniues * 60
      }
    );
  }

  getCookieOpts(options?: Partial<CookieSerializeOptions>): CookieSerializeOptions {
    return {
      path: '/',
      sameSite: true,
      httpOnly: true,
      maxAge: this.expireMiniues * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      ...options
    };
  }

  getCookie(req: Request) {
    const value = req.cookies?.[REFRESH_TOKEN_COOKIES] || '';
    const result = cookieParser.signedCookie(value, '');
    return result || value;
  }

  setCookie(res: Response, token: string, options?: Partial<CookieSerializeOptions>) {
    options = this.getCookieOpts(options);

    if (token) {
      return res.cookie(REFRESH_TOKEN_COOKIES, token, options);
    }

    return res.clearCookie(REFRESH_TOKEN_COOKIES, options);
  }

  deleteToken(req: Request) {
    return this.deleteMany({ refreshToken: req.cookies[REFRESH_TOKEN_COOKIES] });
  }
}
