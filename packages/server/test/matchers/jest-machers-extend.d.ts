import * as customMatchers from '../matchers';

type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base];

type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>;

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : void;

type Result = jest.CustomMatcherResult | Promise<jest.CustomMatcherResult>;

type CustomMatchers = SubType<typeof customMatchers, (...args: any[]) => Result>;

type NormalizeCustomMatchers = {
  [K in keyof CustomMatchers]: OmitFirstArg<CustomMatchers[K]>;
};

declare global {
  namespace jest {
    // eslint-disable-next-line
    interface Matchers<R, T = {}> extends NormalizeCustomMatchers {}
  }
}
