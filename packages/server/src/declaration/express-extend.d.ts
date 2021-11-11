import { IJWTSignPayload } from '@/typings';

declare global {
  declare namespace Express {
    export interface User extends IJWTSignPayload {}
  }
}
