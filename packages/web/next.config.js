// @ts-check

const withTM = require('next-transpile-modules')(['@taisiusyut-next/server']);
const { getDependencies } = require('./getDependencies');

const { serverDeps } = getDependencies();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

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

    // Important: return the modified config
    return config;
  },

  api: {
    bodyParser: false
  }
};

module.exports = withTM(config);
