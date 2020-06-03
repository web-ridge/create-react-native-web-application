// config-overrides.js
const {
  addWebpackAlias,
  babelInclude,
  fixBabelImports,
  override,
} = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');

const path = require('path');

module.exports = override(
  addReactRefresh(),
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
  ])
);
