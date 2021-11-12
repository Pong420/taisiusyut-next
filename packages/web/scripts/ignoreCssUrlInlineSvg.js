// @ts-check

// const withTM = require('next-transpile-modules')(['@taisiusyut-next/server']);
// const { getDependencies } = require('./scripts/getDependencies');

// const { serverDeps } = getDependencies();

/**
 * @param {import('webpack').Configuration} config
 */
function ignoreCssUrlInlineSvg(config) {
  for (const rule of config.module.rules) {
    if (typeof rule === 'object' && rule !== null && 'oneOf' in rule) {
      for (const moduleLoader of rule.oneOf) {
        if (!Array.isArray(moduleLoader.use)) continue;
        moduleLoader.use.forEach(use => {
          if (!use) return;
          if (typeof use !== 'object') return;
          if (use.loader.includes('css-loader') && !use.loader.includes('postcss-loader')) {
            if (typeof use.options !== 'string') {
              const defaultUrlOption = use.options.url;
              use.options = {
                ...use.options,
                /**
                 * @param {string} url
                 * @param {string} resourcePath
                 */
                url: (url, resourcePath) => {
                  if (url.includes('data:image/svg+xml')) {
                    return false;
                  }
                  return typeof defaultUrlOption === 'function'
                    ? defaultUrlOption(url, resourcePath)
                    : typeof defaultUrlOption === 'boolean'
                    ? defaultUrlOption
                    : true;
                }
              };
            }
          }
        });
      }
    }
  }
}

module.exports = { ignoreCssUrlInlineSvg };
