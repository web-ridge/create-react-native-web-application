#!/usr/bin/env node
'use strict';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var LogColor = '\x1b[32m';

var {
  spawn
} = require('child_process');

var fs = require('fs-extra');

var path = require('path');

var argv = require('yargs').help().option('name', {
  alias: 'n',
  description: 'Name of the app',
  type: 'string'
}).alias('help', 'h').argv;

if (!argv.name) {
  console.log('You should specify the name of the app with --name');
  process.exit();
} // run the app ;)


app();

function app() {
  return _app.apply(this, arguments);
}

function _app() {
  _app = _asyncToGenerator(function* () {
    var appName = argv.name;
    var appNameWeb = appName + '-web-will-be-deleted-afterwards';
    logSpaced("\n  Creating ".concat(appName, ", brought to you by webRidge.\n\n  Please wait till everything is finished :)\n  \n  "));

    try {
      yield Promise.all([createReactNativeApp(appName), createReactScriptsApp(appNameWeb)]);
    } catch (error) {
      console.log('Could not create React Native project', {
        error
      });
    }

    logSpaced("Created two projects in two directories. Let's merge them to one project ;)");
    var webPackagePath = appNameWeb + '/package.json';
    var webPackageFile = fs.readFileSync(webPackagePath);
    var webPackageJSON = JSON.parse(webPackageFile);
    var webDependencies = Object.keys(webPackageJSON.dependencies).map(packageName => ({
      name: packageName,
      version: webPackageJSON.dependencies[packageName],
      isDev: false
    }));
    var reactNativePackagePath = appName + '/package.json';
    var reactNativePackageFile = fs.readFileSync(reactNativePackagePath);
    var reactNativePackageJSON = JSON.parse(reactNativePackageFile);
    var webScripts = replaceValuesOfObject(prefixObject(webPackageJSON.scripts, 'web:'), 'react-scripts', 'react-app-rewired'); // more like yarn android, yarn ios, yarn web
    //@ts-ignore

    var webStartCommand = webScripts['web:start'];
    delete webScripts['web:start']; //@ts-ignore

    webScripts.web = webStartCommand;
    console.log({
      webScripts
    });

    var mergedPackageJSON = _objectSpread(_objectSpread(_objectSpread({}, reactNativePackageJSON), excludeObjectKeys(webPackageJSON, ['dependencies', 'scripts', 'name'])), {}, {
      scripts: _objectSpread(_objectSpread({}, reactNativePackageJSON.scripts), webScripts)
    }); // write merged package.json down


    fs.writeFileSync(reactNativePackagePath, JSON.stringify(mergedPackageJSON)); // install web packages to native project

    yield installPackages([...webDependencies, {
      name: 'react-native-web'
    }, {
      name: 'react-app-rewired',
      isDev: true
    }, {
      name: 'customize-cra',
      isDev: true
    }, {
      name: 'customize-cra-react-refresh',
      isDev: true
    }, {
      name: '@types/react',
      isDev: true
    }, {
      name: '@types/react-native',
      isDev: true
    }, {
      name: 'typescript',
      isDev: true
    }, {
      name: 'babel-plugin-import',
      isDev: true
    }], appName); // copy template files

    var templateDir = path.dirname(require.main.filename) + '/template';
    console.log({
      templateDir
    });
    fs.copySync(templateDir, appName);
    fs.copySync(appNameWeb + '/src/serviceWorker.js', appName + '/src/serviceWorker.js');
    fs.copySync(appNameWeb + '/public', appName + '/public');
    fs.unlinkSync(appName + '/App.js');
    fs.removeSync(appNameWeb);
    logSpaced("Yeah!! We're done!");
    logSpaced("\n  Start your app with by going to the created directory: 'cd ".concat(appName, "'\n\n    yarn android\n    yarn ios\n    yarn web\n  "));
  });
  return _app.apply(this, arguments);
}

function installPackages(_x, _x2) {
  return _installPackages.apply(this, arguments);
}

function _installPackages() {
  _installPackages = _asyncToGenerator(function* (packages, directory) {
    yield installPackagesAdvanced(packages.filter(p => p.isDev === true), directory, true);
    yield installPackagesAdvanced(packages.filter(p => !p.isDev), directory, false);
  });
  return _installPackages.apply(this, arguments);
}

function installPackagesAdvanced(_x3, _x4, _x5) {
  return _installPackagesAdvanced.apply(this, arguments);
}

function _installPackagesAdvanced() {
  _installPackagesAdvanced = _asyncToGenerator(function* (packages, directory, dev) {
    return new Promise((resolve, reject) => {
      var joinedPackages = packages.map(p => p.name + (p.version ? "@".concat(p.version) : ""));
      console.log({
        joinedPackages
      });
      var createReactNativeProcess = spawn('yarn', ['--cwd', directory, 'add', ...joinedPackages, dev ? '--dev' : undefined].filter(n => !!n), {
        stdio: 'inherit'
      });
      createReactNativeProcess.on('error', function (error) {
        reject(error);
      });
      createReactNativeProcess.on('exit', function (response) {
        resolve(response);
      });
    });
  });
  return _installPackagesAdvanced.apply(this, arguments);
}

function createReactNativeApp(_x6) {
  return _createReactNativeApp.apply(this, arguments);
}

function _createReactNativeApp() {
  _createReactNativeApp = _asyncToGenerator(function* (appName) {
    return new Promise((resolve, reject) => {
      var createReactNativeProcess = spawn('npx', ['react-native', 'init', appName], {
        stdio: 'inherit'
      });
      createReactNativeProcess.on('error', function (error) {
        reject(error);
      });
      createReactNativeProcess.on('exit', function (response) {
        resolve(response);
      });
    });
  });
  return _createReactNativeApp.apply(this, arguments);
}

function createReactScriptsApp(_x7) {
  return _createReactScriptsApp.apply(this, arguments);
}

function _createReactScriptsApp() {
  _createReactScriptsApp = _asyncToGenerator(function* (appName) {
    return new Promise(function (resolve, reject) {
      var createReactNativeProcess = spawn('npx', ['create-react-app', appName], {
        stdio: 'inherit'
      });
      createReactNativeProcess.on('error', function (error) {
        reject(error);
      });
      createReactNativeProcess.on('exit', function (response) {
        resolve(response);
      });
    });
  });
  return _createReactScriptsApp.apply(this, arguments);
}

function logSpaced(args) {
  console.log('');
  console.log(LogColor, args);
  console.log('');
}

function excludeObjectKeys(object, ignoredKeys) {
  var newObject = _objectSpread({}, object);

  ignoredKeys.forEach(function (key) {
    delete newObject[key];
  });
  return newObject;
}

function replaceValuesOfObject(object, search, replace) {
  var newObject = {};
  Object.keys(object).forEach(key => {
    // console.log({ key });
    var value = object[key]; // console.log({ value });

    if (value) {
      newObject[key] = value.replace ? value.replace(search, replace) : value;
    }
  });
  return newObject;
}

function prefixObject(object, prefix) {
  var newObject = {};
  Object.keys(object).forEach(key => {
    newObject[prefix + key] = object[key];
  });
  return newObject;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJMb2dDb2xvciIsInNwYXduIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImFyZ3YiLCJoZWxwIiwib3B0aW9uIiwiYWxpYXMiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJleGl0IiwiYXBwIiwiYXBwTmFtZSIsImFwcE5hbWVXZWIiLCJsb2dTcGFjZWQiLCJQcm9taXNlIiwiYWxsIiwiY3JlYXRlUmVhY3ROYXRpdmVBcHAiLCJjcmVhdGVSZWFjdFNjcmlwdHNBcHAiLCJlcnJvciIsIndlYlBhY2thZ2VQYXRoIiwid2ViUGFja2FnZUZpbGUiLCJyZWFkRmlsZVN5bmMiLCJ3ZWJQYWNrYWdlSlNPTiIsIkpTT04iLCJwYXJzZSIsIndlYkRlcGVuZGVuY2llcyIsIk9iamVjdCIsImtleXMiLCJkZXBlbmRlbmNpZXMiLCJtYXAiLCJwYWNrYWdlTmFtZSIsInZlcnNpb24iLCJpc0RldiIsInJlYWN0TmF0aXZlUGFja2FnZVBhdGgiLCJyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlIiwicmVhY3ROYXRpdmVQYWNrYWdlSlNPTiIsIndlYlNjcmlwdHMiLCJyZXBsYWNlVmFsdWVzT2ZPYmplY3QiLCJwcmVmaXhPYmplY3QiLCJzY3JpcHRzIiwid2ViU3RhcnRDb21tYW5kIiwid2ViIiwibWVyZ2VkUGFja2FnZUpTT04iLCJleGNsdWRlT2JqZWN0S2V5cyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJpbnN0YWxsUGFja2FnZXMiLCJ0ZW1wbGF0ZURpciIsImRpcm5hbWUiLCJtYWluIiwiZmlsZW5hbWUiLCJjb3B5U3luYyIsInVubGlua1N5bmMiLCJyZW1vdmVTeW5jIiwicGFja2FnZXMiLCJkaXJlY3RvcnkiLCJpbnN0YWxsUGFja2FnZXNBZHZhbmNlZCIsImZpbHRlciIsInAiLCJkZXYiLCJyZXNvbHZlIiwicmVqZWN0Iiwiam9pbmVkUGFja2FnZXMiLCJjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MiLCJ1bmRlZmluZWQiLCJuIiwic3RkaW8iLCJvbiIsInJlc3BvbnNlIiwiYXJncyIsIm9iamVjdCIsImlnbm9yZWRLZXlzIiwibmV3T2JqZWN0IiwiZm9yRWFjaCIsImtleSIsInNlYXJjaCIsInJlcGxhY2UiLCJ2YWx1ZSIsInByZWZpeCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7Ozs7Ozs7Ozs7O0FBTUEsSUFBTUEsUUFBUSxHQUFHLFVBQWpCOztBQUVBLElBQU07QUFBRUMsRUFBQUE7QUFBRixJQUFZQyxPQUFPLENBQUMsZUFBRCxDQUF6Qjs7QUFDQSxJQUFNQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxVQUFELENBQWxCOztBQUNBLElBQU1FLElBQUksR0FBR0YsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsSUFBTUcsSUFBSSxHQUFHSCxPQUFPLENBQUMsT0FBRCxDQUFQLENBQ1ZJLElBRFUsR0FFVkMsTUFGVSxDQUVILE1BRkcsRUFFSztBQUNkQyxFQUFBQSxLQUFLLEVBQUUsR0FETztBQUVkQyxFQUFBQSxXQUFXLEVBQUUsaUJBRkM7QUFHZEMsRUFBQUEsSUFBSSxFQUFFO0FBSFEsQ0FGTCxFQU9WRixLQVBVLENBT0osTUFQSSxFQU9JLEdBUEosRUFPU0gsSUFQdEI7O0FBU0EsSUFBSSxDQUFDQSxJQUFJLENBQUNNLElBQVYsRUFBZ0I7QUFDZEMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0RBQVo7QUFDQUMsRUFBQUEsT0FBTyxDQUFDQyxJQUFSO0FBQ0QsQyxDQUVEOzs7QUFDQUMsR0FBRzs7U0FFWUEsRzs7Ozs7MkJBQWYsYUFBcUI7QUFDbkIsUUFBTUMsT0FBTyxHQUFHWixJQUFJLENBQUNNLElBQXJCO0FBQ0EsUUFBTU8sVUFBVSxHQUFHRCxPQUFPLEdBQUcsaUNBQTdCO0FBRUFFLElBQUFBLFNBQVMsd0JBQ0VGLE9BREYsMkZBQVQ7O0FBT0EsUUFBSTtBQUNGLFlBQU1HLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLENBQ2hCQyxvQkFBb0IsQ0FB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LElBQVAsQ0FBWTJDLE1BQVosRUFBb0JHLE9BQXBCLENBQTZCQyxHQUFELElBQVM7QUFDbkNGLElBQUFBLFNBQVMsQ0FBQ00sTUFBTSxHQUFHSixHQUFWLENBQVQsR0FBMEJKLE1BQU0sQ0FBQ0ksR0FBRCxDQUFoQztBQUNELEdBRkQ7QUFHQSxTQUFPRixTQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG4ndXNlIHN0cmljdCc7XG5pbnRlcmZhY2UgUGFja2FnZVR5cGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHZlcnNpb24/OiBzdHJpbmc7XG4gIGlzRGV2PzogYm9vbGVhbjtcbn1cbmNvbnN0IExvZ0NvbG9yID0gJ1xceDFiWzMybSc7XG5cbmNvbnN0IHsgc3Bhd24gfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBhcmd2ID0gcmVxdWlyZSgneWFyZ3MnKVxuICAuaGVscCgpXG4gIC5vcHRpb24oJ25hbWUnLCB7XG4gICAgYWxpYXM6ICduJyxcbiAgICBkZXNjcmlwdGlvbjogJ05hbWUgb2YgdGhlIGFwcCcsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gIH0pXG4gIC5hbGlhcygnaGVscCcsICdoJykuYXJndjtcblxuaWYgKCFhcmd2Lm5hbWUpIHtcbiAgY29uc29sZS5sb2coJ1lvdSBzaG91bGQgc3BlY2lmeSB0aGUgbmFtZSBvZiB0aGUgYXBwIHdpdGggLS1uYW1lJyk7XG4gIHByb2Nlc3MuZXhpdCgpO1xufVxuXG4vLyBydW4gdGhlIGFwcCA7KVxuYXBwKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGFwcCgpIHtcbiAgY29uc3QgYXBwTmFtZSA9IGFyZ3YubmFtZTtcbiAgY29uc3QgYXBwTmFtZVdlYiA9IGFwcE5hbWUgKyAnLXdlYi13aWxsLWJlLWRlbGV0ZWQtYWZ0ZXJ3YXJkcyc7XG5cbiAgbG9nU3BhY2VkKGBcbiAgQ3JlYXRpbmcgJHthcHBOYW1lfSwgYnJvdWdodCB0byB5b3UgYnkgd2ViUmlkZ2UuXG5cbiAgUGxlYXNlIHdhaXQgdGlsbCBldmVyeXRoaW5nIGlzIGZpbmlzaGVkIDopXG4gIFxuICBgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGNyZWF0ZVJlYWN0TmF0aXZlQXBwKGFwcE5hbWUpLFxuICAgICAgY3JlYXRlUmVhY3RTY3JpcHRzQXBwKGFwcE5hbWVXZWIpLFxuICAgIF0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgY3JlYXRlIFJlYWN0IE5hdGl2ZSBwcm9qZWN0JywgeyBlcnJvciB9KTtcbiAgfVxuXG4gIGxvZ1NwYWNlZChcbiAgICBcIkNyZWF0ZWQgdHdvIHByb2plY3RzIGluIHR3byBkaXJlY3Rvcmllcy4gTGV0J3MgbWVyZ2UgdGhlbSB0byBvbmUgcHJvamVjdCA7KVwiXG4gICk7XG5cbiAgY29uc3Qgd2ViUGFja2FnZVBhdGggPSBhcHBOYW1lV2ViICsgJy9wYWNrYWdlLmpzb24nO1xuICBjb25zdCB3ZWJQYWNrYWdlRmlsZSA9IGZzLnJlYWRGaWxlU3luYyh3ZWJQYWNrYWdlUGF0aCk7XG4gIGNvbnN0IHdlYlBhY2thZ2VKU09OID0gSlNPTi5wYXJzZSh3ZWJQYWNrYWdlRmlsZSk7XG5cbiAgY29uc3Qgd2ViRGVwZW5kZW5jaWVzOiBQYWNrYWdlVHlwZVtdID0gT2JqZWN0LmtleXMoXG4gICAgd2ViUGFja2FnZUpTT04uZGVwZW5kZW5jaWVzXG4gICkubWFwKChwYWNrYWdlTmFtZSkgPT4gKHtcbiAgICBuYW1lOiBwYWNrYWdlTmFtZSxcbiAgICB2ZXJzaW9uOiB3ZWJQYWNrYWdlSlNPTi5kZXBlbmRlbmNpZXNbcGFja2FnZU5hbWVdLFxuICAgIGlzRGV2OiBmYWxzZSxcbiAgfSkpO1xuXG4gIGNvbnN0IHJlYWN0TmF0aXZlUGFja2FnZVBhdGggPSBhcHBOYW1lICsgJy9wYWNrYWdlLmpzb24nO1xuICBjb25zdCByZWFjdE5hdGl2ZVBhY2thZ2VGaWxlID0gZnMucmVhZEZpbGVTeW5jKHJlYWN0TmF0aXZlUGFja2FnZVBhdGgpO1xuICBjb25zdCByZWFjdE5hdGl2ZVBhY2thZ2VKU09OID0gSlNPTi5wYXJzZShyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlKTtcblxuICBsZXQgd2ViU2NyaXB0cyA9IHJlcGxhY2VWYWx1ZXNPZk9iamVjdChcbiAgICBwcmVmaXhPYmplY3Qod2ViUGFja2FnZUpTT04uc2NyaXB0cywgJ3dlYjonKSxcbiAgICAncmVhY3Qtc2NyaXB0cycsXG4gICAgJ3JlYWN0LWFwcC1yZXdpcmVkJ1xuICApO1xuXG4gIC8vIG1vcmUgbGlrZSB5YXJuIGFuZHJvaWQsIHlhcm4gaW9zLCB5YXJuIHdlYlxuICAvL0B0cy1pZ25vcmVcbiAgbGV0IHdlYlN0YXJ0Q29tbWFuZCA9IHdlYlNjcmlwdHNbJ3dlYjpzdGFydCddO1xuICBkZWxldGUgd2ViU2NyaXB0c1snd2ViOnN0YXJ0J107XG4gIC8vQHRzLWlnbm9yZVxuICB3ZWJTY3JpcHRzLndlYiA9IHdlYlN0YXJ0Q29tbWFuZDtcblxuICBjb25zb2xlLmxvZyh7IHdlYlNjcmlwdHMgfSk7XG5cbiAgY29uc3QgbWVyZ2VkUGFja2FnZUpTT04gPSB7XG4gICAgLi4ucmVhY3ROYXRpdmVQYWNrYWdlSlNPTixcbiAgICAvLyB3ZSdyZSBnb25uYSBtZXJnZSBzY3JpcHRzIGFuZCBkZXBlbmRlbmNpZXMgb3Vyc2VsZiA6KVxuICAgIC4uLmV4Y2x1ZGVPYmplY3RLZXlzKHdlYlBhY2thZ2VKU09OLCBbJ2RlcGVuZGVuY2llcycsICdzY3JpcHRzJywgJ25hbWUnXSksXG4gICAgc2NyaXB0czoge1xuICAgICAgLi4ucmVhY3ROYXRpdmVQYWNrYWdlSlNPTi5zY3JpcHRzLFxuICAgICAgLi4ud2ViU2NyaXB0cyxcbiAgICB9LFxuICB9O1xuXG4gIC8vIHdyaXRlIG1lcmdlZCBwYWNrYWdlLmpzb24gZG93blxuICBmcy53cml0ZUZpbGVTeW5jKHJlYWN0TmF0aXZlUGFja2FnZVBhdGgsIEpTT04uc3RyaW5naWZ5KG1lcmdlZFBhY2thZ2VKU09OKSk7XG5cbiAgLy8gaW5zdGFsbCB3ZWIgcGFja2FnZXMgdG8gbmF0aXZlIHByb2plY3RcbiAgYXdhaXQgaW5zdGFsbFBhY2thZ2VzKFxuICAgIFtcbiAgICAgIC4uLndlYkRlcGVuZGVuY2llcyxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3JlYWN0LW5hdGl2ZS13ZWInLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3JlYWN0LWFwcC1yZXdpcmVkJyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnY3VzdG9taXplLWNyYScsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2N1c3RvbWl6ZS1jcmEtcmVhY3QtcmVmcmVzaCcsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0B0eXBlcy9yZWFjdCcsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHsgbmFtZTogJ0B0eXBlcy9yZWFjdC1uYXRpdmUnLCBpc0RldjogdHJ1ZSB9LFxuICAgICAgeyBuYW1lOiAndHlwZXNjcmlwdCcsIGlzRGV2OiB0cnVlIH0sXG4gICAgICB7IG5hbWU6ICdiYWJlbC1wbHVnaW4taW1wb3J0JywgaXNEZXY6IHRydWUgfSxcbiAgICBdLFxuICAgIGFwcE5hbWVcbiAgKTtcblxuICAvLyBjb3B5IHRlbXBsYXRlIGZpbGVzXG5cbiAgY29uc3QgdGVtcGxhdGVEaXIgPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5tYWluLmZpbGVuYW1lKSArICcvdGVtcGxhdGUnO1xuICBjb25zb2xlLmxvZyh7IHRlbXBsYXRlRGlyIH0pO1xuICBmcy5jb3B5U3luYyh0ZW1wbGF0ZURpciwgYXBwTmFtZSk7XG4gIGZzLmNvcHlTeW5jKFxuICAgIGFwcE5hbWVXZWIgKyAnL3NyYy9zZXJ2aWNlV29ya2VyLmpzJyxcbiAgICBhcHBOYW1lICsgJy9zcmMvc2VydmljZVdvcmtlci5qcydcbiAgKTtcbiAgZnMuY29weVN5bmMoYXBwTmFtZVdlYiArICcvcHVibGljJywgYXBwTmFtZSArICcvcHVibGljJyk7XG4gIGZzLnVubGlua1N5bmMoYXBwTmFtZSArICcvQXBwLmpzJyk7XG4gIGZzLnJlbW92ZVN5bmMoYXBwTmFtZVdlYik7XG5cbiAgbG9nU3BhY2VkKFwiWWVhaCEhIFdlJ3JlIGRvbmUhXCIpO1xuICBsb2dTcGFjZWQoYFxuICBTdGFydCB5b3VyIGFwcCB3aXRoIGJ5IGdvaW5nIHRvIHRoZSBjcmVhdGVkIGRpcmVjdG9yeTogJ2NkICR7YXBwTmFtZX0nXG5cbiAgICB5YXJuIGFuZHJvaWRcbiAgICB5YXJuIGlvc1xuICAgIHlhcm4gd2ViXG4gIGApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbnN0YWxsUGFja2FnZXMocGFja2FnZXM6IFBhY2thZ2VUeXBlW10sIGRpcmVjdG9yeTogc3RyaW5nKSB7XG4gIGF3YWl0IGluc3RhbGxQYWNrYWdlc0FkdmFuY2VkKFxuICAgIHBhY2thZ2VzLmZpbHRlcigocCkgPT4gcC5pc0RldiA9PT0gdHJ1ZSksXG4gICAgZGlyZWN0b3J5LFxuICAgIHRydWVcbiAgKTtcbiAgYXdhaXQgaW5zdGFsbFBhY2thZ2VzQWR2YW5jZWQoXG4gICAgcGFja2FnZXMuZmlsdGVyKChwKSA9PiAhcC5pc0RldiksXG4gICAgZGlyZWN0b3J5LFxuICAgIGZhbHNlXG4gICk7XG59XG5hc3luYyBmdW5jdGlvbiBpbnN0YWxsUGFja2FnZXNBZHZhbmNlZChcbiAgcGFja2FnZXM6IFBhY2thZ2VUeXBlW10sXG4gIGRpcmVjdG9yeTogc3RyaW5nLFxuICBkZXY6IGJvb2xlYW5cbik6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgam9pbmVkUGFja2FnZXMgPSBwYWNrYWdlcy5tYXAoXG4gICAgICAocCkgPT4gcC5uYW1lICsgKHAudmVyc2lvbiA/IGBAJHtwLnZlcnNpb259YCA6IGBgKVxuICAgICk7XG4gICAgY29uc29sZS5sb2coeyBqb2luZWRQYWNrYWdlcyB9KTtcbiAgICBjb25zdCBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MgPSBzcGF3bihcbiAgICAgICd5YXJuJyxcbiAgICAgIFtcbiAgICAgICAgJy0tY3dkJyxcbiAgICAgICAgZGlyZWN0b3J5LFxuICAgICAgICAnYWRkJyxcbiAgICAgICAgLi4uam9pbmVkUGFja2FnZXMsXG4gICAgICAgIGRldiA/ICctLWRldicgOiB1bmRlZmluZWQsXG4gICAgICBdLmZpbHRlcigobikgPT4gISFuKSxcbiAgICAgIHsgc3RkaW86ICdpbmhlcml0JyB9XG4gICAgKTtcblxuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVJlYWN0TmF0aXZlQXBwKGFwcE5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzID0gc3Bhd24oXG4gICAgICAnbnB4JyxcbiAgICAgIFsncmVhY3QtbmF0aXZlJywgJ2luaXQnLCBhcHBOYW1lXSxcbiAgICAgIHsgc3RkaW86ICdpbmhlcml0JyB9XG4gICAgKTtcblxuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVJlYWN0U2NyaXB0c0FwcChhcHBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8YW55PihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgY29uc3QgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzID0gc3Bhd24oXG4gICAgICAnbnB4JyxcbiAgICAgIFsnY3JlYXRlLXJlYWN0LWFwcCcsIGFwcE5hbWVdLFxuICAgICAgeyBzdGRpbzogJ2luaGVyaXQnIH1cbiAgICApO1xuXG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9nU3BhY2VkKGFyZ3MpIHtcbiAgY29uc29sZS5sb2coJycpO1xuICBjb25zb2xlLmxvZyhMb2dDb2xvciwgYXJncyk7XG4gIGNvbnNvbGUubG9nKCcnKTtcbn1cblxuZnVuY3Rpb24gZXhjbHVkZU9iamVjdEtleXMob2JqZWN0OiBvYmplY3QsIGlnbm9yZWRLZXlzOiBzdHJpbmdbXSk6IG9iamVjdCB7XG4gIGxldCBuZXdPYmplY3QgPSB7IC4uLm9iamVjdCB9O1xuICBpZ25vcmVkS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBkZWxldGUgbmV3T2JqZWN0W2tleV07XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqZWN0O1xufVxuXG5mdW5jdGlvbiByZXBsYWNlVmFsdWVzT2ZPYmplY3QoXG4gIG9iamVjdDogb2JqZWN0LFxuICBzZWFyY2g6IHN0cmluZyxcbiAgcmVwbGFjZTogc3RyaW5nXG4pOiBvYmplY3Qge1xuICBsZXQgbmV3T2JqZWN0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coeyBrZXkgfSk7XG4gICAgY29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAvLyBjb25zb2xlLmxvZyh7IHZhbHVlIH0pO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgbmV3T2JqZWN0W2tleV0gPSB2YWx1ZS5yZXBsYWNlID8gdmFsdWUucmVwbGFjZShzZWFyY2gsIHJlcGxhY2UpIDogdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG5ld09iamVjdDtcbn1cblxuZnVuY3Rpb24gcHJlZml4T2JqZWN0KG9iamVjdDogb2JqZWN0LCBwcmVmaXg6IHN0cmluZyk6IG9iamVjdCB7XG4gIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBuZXdPYmplY3RbcHJlZml4ICsga2V5XSA9IG9iamVjdFtrZXldO1xuICB9KTtcbiAgcmV0dXJuIG5ld09iamVjdDtcbn1cbiJdfQ==