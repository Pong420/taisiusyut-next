// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('../tsconfig.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
  displayName: 'e2e',
  rootDir: path.join(__dirname, '../'),
  setupFilesAfterEnv: ['<rootDir>/test/matchers/index.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  testEnvironment: '<rootDir>/dist/test-environments/nest-environment.js',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};

module.exports = config;
