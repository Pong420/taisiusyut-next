import jwt from 'jsonwebtoken';
import { IJWTSignPayload, IAuthenticated } from '@/typings';

export function signJwt(payload: IJWTSignPayload): IAuthenticated {
  const now = +new Date();
  const minutes = Number(process.env.JWT_TOKEN_EXPIRES_IN_MINUTES || 0);

  if (!minutes || typeof minutes !== 'number') throw new Error('jwt expires not configured');

  const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
    expiresIn: `${minutes}m`
  });

  return {
    token,
    user: payload,
    expiry: new Date(now + minutes * 60 * 1000)
  };
}
