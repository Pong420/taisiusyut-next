// @ts-check

const fs = require('fs');
const { getDependencies } = require('./getDependencies');

if (process.env.VERCEL_SERVER) {
  const { serverDeps, webPackageJSON: pkg } = getDependencies();
  const packageJSONPath = __dirname + '/package.json';
  fs.writeFileSync(
    packageJSONPath,
    JSON.stringify({ ...pkg, dependencies: { ...pkg.dependencies, ...serverDeps } }, null, 2)
  );
}
