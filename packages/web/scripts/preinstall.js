// @ts-check

const fs = require('fs');
const path = require('path');
const { getDependencies } = require('./getDependencies');

if (process.env.VERCEL_SERVER) {
  const { serverDeps, webPackageJSON: pkg } = getDependencies();
  const packageJSONPath = path.join(__dirname, '../package.json');
  fs.writeFileSync(
    packageJSONPath,
    JSON.stringify({ ...pkg, dependencies: { ...pkg.dependencies, ...serverDeps } }, null, 2)
  );
}
