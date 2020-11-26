// config-overrides.js
const {
  addWebpackAlias,
  babelInclude,
  fixBabelImports,
  override,
} = require('customize-cra');

const path = require('path');

module.exports = override(
  fixBabelImports('module-resolver', {
    alias: {
      '^react-native$': 'react-native-web',
    },
  }),
  addWebpackAlias({
    'react-native': 'react-native-web',
    // here you can add extra packages
  }),
  babelInclude([
    path.resolve('src'),
    path.resolve('app.json'),

    // any react-native modules you need babel to compile
    // e.g.  path.resolve('./node_modules/react-native-vector-icons'),
  ])
);
