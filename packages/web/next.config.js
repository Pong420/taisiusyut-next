// @ts-check

const withTM = require('next-transpile-modules')(['@taisiusyut-next/server']);
const withPWA = require('next-pwa');
const { getDependencies } = require('./scripts/getDependencies');
const { ignoreCssUrlInlineSvg } = require('./scripts/ignoreCssUrlInlineSvg');
const { repository } = require('../../package.json');

const { serverDeps } = getDependencies();

/**
 * @typedef {{ disable?: boolean }} NextPWAConfig
 * @typedef {import('next').NextConfig & { pwa?: NextPWAConfig }} NextConfig
 */

/** @type {NextConfig & NextPWAConfig} */
const config = {
  // for @blueprintjs
  reactStrictMode: false,

  /**
   * @param {import('webpack').Configuration} config
   * @param {*} param1
   */
  webpack: (config, _options) => {
    if (Array.isArray(config.externals)) {
      config.externals.push(...Object.keys(serverDeps), /^@nestjs/);
    } else {
      throw `webpack config externals is ${config.externals}`;
    }

    ignoreCssUrlInlineSvg(config);

    // Important: return the modified config
    return config;
  },

  api: {
    bodyParser: false
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    repositoryUrl: repository.url
  },

  pwa: {
    disable: process.env.NODE_ENV !== 'production'
  }
};

module.exports = withPWA(withTM(config));
