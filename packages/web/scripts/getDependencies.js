function getDependencies() {
  const server = require('../../server/package.json');
  const web = require('../package.json');

  /**
   * @type {Record<string, boolean>}
   */
  const serverDeps = {};
  const deps = { ...server.dependencies };

  for (const key in deps) {
    if (!web.dependencies[key]) {
      serverDeps[key] = deps[key];
    }
  }

  return { serverDeps, webPackageJSON: web };
}

module.exports = { getDependencies };
