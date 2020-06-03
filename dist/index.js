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

    webScripts.web = webStartCommand; // console.log({ webScripts });

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
    logSpaced({
      templateDir
    });
    fs.copySync(templateDir, appName);
    fs.copySync(appNameWeb + '/src/serviceWorker.js', appName + '/src/serviceWorker.js', {
      overwrite: false
    });
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
      var joinedPackages = packages.map(p => p.name + (p.version ? "@".concat(p.version) : "")); // console.log({ joinedPackages });

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

function removeSuffix(str, suffix) {
  return str.substring(0, str.indexOf(suffix));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJMb2dDb2xvciIsInNwYXduIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImFyZ3YiLCJoZWxwIiwib3B0aW9uIiwiYWxpYXMiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJleGl0IiwiYXBwIiwiYXBwTmFtZSIsImFwcE5hbWVXZWIiLCJsb2dTcGFjZWQiLCJQcm9taXNlIiwiYWxsIiwiY3JlYXRlUmVhY3ROYXRpdmVBcHAiLCJjcmVhdGVSZWFjdFNjcmlwdHNBcHAiLCJlcnJvciIsIndlYlBhY2thZ2VQYXRoIiwid2ViUGFja2FnZUZpbGUiLCJyZWFkRmlsZVN5bmMiLCJ3ZWJQYWNrYWdlSlNPTiIsIkpTT04iLCJwYXJzZSIsIndlYkRlcGVuZGVuY2llcyIsIk9iamVjdCIsImtleXMiLCJkZXBlbmRlbmNpZXMiLCJtYXAiLCJwYWNrYWdlTmFtZSIsInZlcnNpb24iLCJpc0RldiIsInJlYWN0TmF0aXZlUGFja2FnZVBhdGgiLCJyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlIiwicmVhY3ROYXRpdmVQYWNrYWdlSlNPTiIsIndlYlNjcmlwdHMiLCJyZXBsYWNlVmFsdWVzT2ZPYmplY3QiLCJwcmVmaXhPYmplY3QiLCJzY3JpcHRzIiwid2ViU3RhcnRDb21tYW5kIiwid2ViIiwibWVyZ2VkUGFja2FnZUpTT04iLCJleGNsdWRlT2JqZWN0S2V5cyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJpbnN0YWxsUGFja2FnZXMiLCJ0ZW1wbGF0ZURpciIsImRpcm5hbWUiLCJtYWluIiwiZmlsZW5hbWUiLCJjb3B5U3luYyIsIm92ZXJ3cml0ZSIsInVubGlua1N5bmMiLCJyZW1vdmVTeW5jIiwicGFja2FnZXMiLCJkaXJlY3RvcnkiLCJpbnN0YWxsUGFja2FnZXNBZHZhbmNlZCIsImZpbHRlciIsInAiLCJkZXYiLCJyZXNvbHZlIiwicmVqZWN0Iiwiam9pbmVkUGFja2FnZXMiLCJjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MiLCJ1bmRlZmluZWQiLCJuIiwic3RkaW8iLCJvbiIsInJlc3BvbnNlIiwiYXJncyIsInJlbW92ZVN1ZmZpeCIsInN0ciIsInN1ZmZpeCIsInN1YnN0cmluZyIsImluZGV4T2YiLCJvYmplY3QiLCJpZ25vcmVkS2V5cyIsIm5ld09iamVjdCIsImZvckVhY2giLCJrZXkiLCJzZWFyY2giLCJyZXBsYWNlIiwidmFsdWUiLCJwcmVmaXgiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7Ozs7Ozs7Ozs7OztBQU1BLElBQU1BLFFBQVEsR0FBRyxVQUFqQjs7QUFFQSxJQUFNO0FBQUVDLEVBQUFBO0FBQUYsSUFBWUMsT0FBTyxDQUFDLGVBQUQsQ0FBekI7O0FBQ0EsSUFBTUMsRUFBRSxHQUFHRCxPQUFPLENBQUMsVUFBRCxDQUFsQjs7QUFDQSxJQUFNRSxJQUFJLEdBQUdGLE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLElBQU1HLElBQUksR0FBR0gsT0FBTyxDQUFDLE9BQUQsQ0FBUCxDQUNWSSxJQURVLEdBRVZDLE1BRlUsQ0FFSCxNQUZHLEVBRUs7QUFDZEMsRUFBQUEsS0FBSyxFQUFFLEdBRE87QUFFZEMsRUFBQUEsV0FBVyxFQUFFLGlCQUZDO0FBR2RDLEVBQUFBLElBQUksRUFBRTtBQUhRLENBRkwsRUFPVkYsS0FQVSxDQU9KLE1BUEksRUFPSSxHQVBKLEVBT1NILElBUHRCOztBQVNBLElBQUksQ0FBQ0EsSUFBSSxDQUFDTSxJQUFWLEVBQWdCO0FBQ2RDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9EQUFaO0FBQ0FDLEVBQUFBLE9BQU8sQ0FBQ0MsSUFBUjtBQUNELEMsQ0FFRDs7O0FBQ0FDLEdBQUc7O1NBRVlBLEc7Ozs7OzJCQUFmLGFBQXFCO0FBQ25CLFFBQU1DLE9BQU8sR0FBR1osSUFBSSxDQUFDTSxJQUFyQjtBQUNBLFFBQU1PLFVBQVUsR0FBR0QsT0FBTyxHQUFHLGlDQUE3QjtBQUVBRSxJQUFBQSxTQUFTLHdCQUNFRixPQURGLDJG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QWlEQyxLQUFsRTtBQUNEO0FBQ0YsR0FQRDtBQVFBLFNBQU9MLFNBQVA7QUFDRDs7QUFFRCxTQUFTeEMsWUFBVCxDQUFzQnNDLE1BQXRCLEVBQXNDUSxNQUF0QyxFQUE4RDtBQUM1RCxNQUFJTixTQUFTLEdBQUcsRUFBaEI7QUFDQXBELEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZaUQsTUFBWixFQUFvQkcsT0FBcEIsQ0FBNkJDLEdBQUQsSUFBUztBQUNuQ0YsSUFBQUEsU0FBUyxDQUFDTSxNQUFNLEdBQUdKLEdBQVYsQ0FBVCxHQUEwQkosTUFBTSxDQUFDSSxHQUFELENBQWhDO0FBQ0QsR0FGRDtBQUdBLFNBQU9GLFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbid1c2Ugc3RyaWN0JztcbmludGVyZmFjZSBQYWNrYWdlVHlwZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdmVyc2lvbj86IHN0cmluZztcbiAgaXNEZXY/OiBib29sZWFuO1xufVxuY29uc3QgTG9nQ29sb3IgPSAnXFx4MWJbMzJtJztcblxuY29uc3QgeyBzcGF3biB9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGFyZ3YgPSByZXF1aXJlKCd5YXJncycpXG4gIC5oZWxwKClcbiAgLm9wdGlvbignbmFtZScsIHtcbiAgICBhbGlhczogJ24nLFxuICAgIGRlc2NyaXB0aW9uOiAnTmFtZSBvZiB0aGUgYXBwJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgfSlcbiAgLmFsaWFzKCdoZWxwJywgJ2gnKS5hcmd2O1xuXG5pZiAoIWFyZ3YubmFtZSkge1xuICBjb25zb2xlLmxvZygnWW91IHNob3VsZCBzcGVjaWZ5IHRoZSBuYW1lIG9mIHRoZSBhcHAgd2l0aCAtLW5hbWUnKTtcbiAgcHJvY2Vzcy5leGl0KCk7XG59XG5cbi8vIHJ1biB0aGUgYXBwIDspXG5hcHAoKTtcblxuYXN5bmMgZnVuY3Rpb24gYXBwKCkge1xuICBjb25zdCBhcHBOYW1lID0gYXJndi5uYW1lO1xuICBjb25zdCBhcHBOYW1lV2ViID0gYXBwTmFtZSArICctd2ViLXdpbGwtYmUtZGVsZXRlZC1hZnRlcndhcmRzJztcblxuICBsb2dTcGFjZWQoYFxuICBDcmVhdGluZyAke2FwcE5hbWV9LCBicm91Z2h0IHRvIHlvdSBieSB3ZWJSaWRnZS5cblxuICBQbGVhc2Ugd2FpdCB0aWxsIGV2ZXJ5dGhpbmcgaXMgZmluaXNoZWQgOilcbiAgXG4gIGApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgY3JlYXRlUmVhY3ROYXRpdmVBcHAoYXBwTmFtZSksXG4gICAgICBjcmVhdGVSZWFjdFNjcmlwdHNBcHAoYXBwTmFtZVdlYiksXG4gICAgXSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBjcmVhdGUgUmVhY3QgTmF0aXZlIHByb2plY3QnLCB7IGVycm9yIH0pO1xuICB9XG5cbiAgbG9nU3BhY2VkKFxuICAgIFwiQ3JlYXRlZCB0d28gcHJvamVjdHMgaW4gdHdvIGRpcmVjdG9yaWVzLiBMZXQncyBtZXJnZSB0aGVtIHRvIG9uZSBwcm9qZWN0IDspXCJcbiAgKTtcblxuICBjb25zdCB3ZWJQYWNrYWdlUGF0aCA9IGFwcE5hbWVXZWIgKyAnL3BhY2thZ2UuanNvbic7XG4gIGNvbnN0IHdlYlBhY2thZ2VGaWxlID0gZnMucmVhZEZpbGVTeW5jKHdlYlBhY2thZ2VQYXRoKTtcbiAgY29uc3Qgd2ViUGFja2FnZUpTT04gPSBKU09OLnBhcnNlKHdlYlBhY2thZ2VGaWxlKTtcblxuICBjb25zdCB3ZWJEZXBlbmRlbmNpZXM6IFBhY2thZ2VUeXBlW10gPSBPYmplY3Qua2V5cyhcbiAgICB3ZWJQYWNrYWdlSlNPTi5kZXBlbmRlbmNpZXNcbiAgKS5tYXAoKHBhY2thZ2VOYW1lKSA9PiAoe1xuICAgIG5hbWU6IHBhY2thZ2VOYW1lLFxuICAgIHZlcnNpb246IHdlYlBhY2thZ2VKU09OLmRlcGVuZGVuY2llc1twYWNrYWdlTmFtZV0sXG4gICAgaXNEZXY6IGZhbHNlLFxuICB9KSk7XG5cbiAgY29uc3QgcmVhY3ROYXRpdmVQYWNrYWdlUGF0aCA9IGFwcE5hbWUgKyAnL3BhY2thZ2UuanNvbic7XG4gIGNvbnN0IHJlYWN0TmF0aXZlUGFja2FnZUZpbGUgPSBmcy5yZWFkRmlsZVN5bmMocmVhY3ROYXRpdmVQYWNrYWdlUGF0aCk7XG4gIGNvbnN0IHJlYWN0TmF0aXZlUGFja2FnZUpTT04gPSBKU09OLnBhcnNlKHJlYWN0TmF0aXZlUGFja2FnZUZpbGUpO1xuXG4gIGxldCB3ZWJTY3JpcHRzID0gcmVwbGFjZVZhbHVlc09mT2JqZWN0KFxuICAgIHByZWZpeE9iamVjdCh3ZWJQYWNrYWdlSlNPTi5zY3JpcHRzLCAnd2ViOicpLFxuICAgICdyZWFjdC1zY3JpcHRzJyxcbiAgICAncmVhY3QtYXBwLXJld2lyZWQnXG4gICk7XG5cbiAgLy8gbW9yZSBsaWtlIHlhcm4gYW5kcm9pZCwgeWFybiBpb3MsIHlhcm4gd2ViXG4gIC8vQHRzLWlnbm9yZVxuICBsZXQgd2ViU3RhcnRDb21tYW5kID0gd2ViU2NyaXB0c1snd2ViOnN0YXJ0J107XG4gIGRlbGV0ZSB3ZWJTY3JpcHRzWyd3ZWI6c3RhcnQnXTtcbiAgLy9AdHMtaWdub3JlXG4gIHdlYlNjcmlwdHMud2ViID0gd2ViU3RhcnRDb21tYW5kO1xuXG4gIC8vIGNvbnNvbGUubG9nKHsgd2ViU2NyaXB0cyB9KTtcblxuICBjb25zdCBtZXJnZWRQYWNrYWdlSlNPTiA9IHtcbiAgICAuLi5yZWFjdE5hdGl2ZVBhY2thZ2VKU09OLFxuICAgIC8vIHdlJ3JlIGdvbm5hIG1lcmdlIHNjcmlwdHMgYW5kIGRlcGVuZGVuY2llcyBvdXJzZWxmIDopXG4gICAgLi4uZXhjbHVkZU9iamVjdEtleXMod2ViUGFja2FnZUpTT04sIFsnZGVwZW5kZW5jaWVzJywgJ3NjcmlwdHMnLCAnbmFtZSddKSxcbiAgICBzY3JpcHRzOiB7XG4gICAgICAuLi5yZWFjdE5hdGl2ZVBhY2thZ2VKU09OLnNjcmlwdHMsXG4gICAgICAuLi53ZWJTY3JpcHRzLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gd3JpdGUgbWVyZ2VkIHBhY2thZ2UuanNvbiBkb3duXG4gIGZzLndyaXRlRmlsZVN5bmMocmVhY3ROYXRpdmVQYWNrYWdlUGF0aCwgSlNPTi5zdHJpbmdpZnkobWVyZ2VkUGFja2FnZUpTT04pKTtcblxuICAvLyBpbnN0YWxsIHdlYiBwYWNrYWdlcyB0byBuYXRpdmUgcHJvamVjdFxuICBhd2FpdCBpbnN0YWxsUGFja2FnZXMoXG4gICAgW1xuICAgICAgLi4ud2ViRGVwZW5kZW5jaWVzLFxuICAgICAge1xuICAgICAgICBuYW1lOiAncmVhY3QtbmF0aXZlLXdlYicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAncmVhY3QtYXBwLXJld2lyZWQnLFxuICAgICAgICBpc0RldjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdjdXN0b21pemUtY3JhJyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnY3VzdG9taXplLWNyYS1yZWFjdC1yZWZyZXNoJyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnQHR5cGVzL3JlYWN0JyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAgeyBuYW1lOiAnQHR5cGVzL3JlYWN0LW5hdGl2ZScsIGlzRGV2OiB0cnVlIH0sXG4gICAgICB7IG5hbWU6ICd0eXBlc2NyaXB0JywgaXNEZXY6IHRydWUgfSxcbiAgICAgIHsgbmFtZTogJ2JhYmVsLXBsdWdpbi1pbXBvcnQnLCBpc0RldjogdHJ1ZSB9LFxuICAgIF0sXG4gICAgYXBwTmFtZVxuICApO1xuXG4gIC8vIGNvcHkgdGVtcGxhdGUgZmlsZXNcblxuICBjb25zdCB0ZW1wbGF0ZURpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpICsgJy90ZW1wbGF0ZSc7XG4gIGxvZ1NwYWNlZCh7IHRlbXBsYXRlRGlyIH0pO1xuICBmcy5jb3B5U3luYyh0ZW1wbGF0ZURpciwgYXBwTmFtZSk7XG5cbiAgZnMuY29weVN5bmMoXG4gICAgYXBwTmFtZVdlYiArICcvc3JjL3NlcnZpY2VXb3JrZXIuanMnLFxuICAgIGFwcE5hbWUgKyAnL3NyYy9zZXJ2aWNlV29ya2VyLmpzJyxcbiAgICB7IG92ZXJ3cml0ZTogZmFsc2UgfVxuICApO1xuICBmcy5jb3B5U3luYyhhcHBOYW1lV2ViICsgJy9wdWJsaWMnLCBhcHBOYW1lICsgJy9wdWJsaWMnKTtcbiAgZnMudW5saW5rU3luYyhhcHBOYW1lICsgJy9BcHAuanMnKTtcbiAgZnMucmVtb3ZlU3luYyhhcHBOYW1lV2ViKTtcblxuICBsb2dTcGFjZWQoXCJZZWFoISEgV2UncmUgZG9uZSFcIik7XG4gIGxvZ1NwYWNlZChgXG4gIFN0YXJ0IHlvdXIgYXBwIHdpdGggYnkgZ29pbmcgdG8gdGhlIGNyZWF0ZWQgZGlyZWN0b3J5OiAnY2QgJHthcHBOYW1lfSdcblxuICAgIHlhcm4gYW5kcm9pZFxuICAgIHlhcm4gaW9zXG4gICAgeWFybiB3ZWJcbiAgYCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlcyhwYWNrYWdlczogUGFja2FnZVR5cGVbXSwgZGlyZWN0b3J5OiBzdHJpbmcpIHtcbiAgYXdhaXQgaW5zdGFsbFBhY2thZ2VzQWR2YW5jZWQoXG4gICAgcGFja2FnZXMuZmlsdGVyKChwKSA9PiBwLmlzRGV2ID09PSB0cnVlKSxcbiAgICBkaXJlY3RvcnksXG4gICAgdHJ1ZVxuICApO1xuICBhd2FpdCBpbnN0YWxsUGFja2FnZXNBZHZhbmNlZChcbiAgICBwYWNrYWdlcy5maWx0ZXIoKHApID0+ICFwLmlzRGV2KSxcbiAgICBkaXJlY3RvcnksXG4gICAgZmFsc2VcbiAgKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlc0FkdmFuY2VkKFxuICBwYWNrYWdlczogUGFja2FnZVR5cGVbXSxcbiAgZGlyZWN0b3J5OiBzdHJpbmcsXG4gIGRldjogYm9vbGVhblxuKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBqb2luZWRQYWNrYWdlcyA9IHBhY2thZ2VzLm1hcChcbiAgICAgIChwKSA9PiBwLm5hbWUgKyAocC52ZXJzaW9uID8gYEAke3AudmVyc2lvbn1gIDogYGApXG4gICAgKTtcbiAgICAvLyBjb25zb2xlLmxvZyh7IGpvaW5lZFBhY2thZ2VzIH0pO1xuICAgIGNvbnN0IGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2VzcyA9IHNwYXduKFxuICAgICAgJ3lhcm4nLFxuICAgICAgW1xuICAgICAgICAnLS1jd2QnLFxuICAgICAgICBkaXJlY3RvcnksXG4gICAgICAgICdhZGQnLFxuICAgICAgICAuLi5qb2luZWRQYWNrYWdlcyxcbiAgICAgICAgZGV2ID8gJy0tZGV2JyA6IHVuZGVmaW5lZCxcbiAgICAgIF0uZmlsdGVyKChuKSA9PiAhIW4pLFxuICAgICAgeyBzdGRpbzogJ2luaGVyaXQnIH1cbiAgICApO1xuXG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlUmVhY3ROYXRpdmVBcHAoYXBwTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MgPSBzcGF3bihcbiAgICAgICducHgnLFxuICAgICAgWydyZWFjdC1uYXRpdmUnLCAnaW5pdCcsIGFwcE5hbWVdLFxuICAgICAgeyBzdGRpbzogJ2luaGVyaXQnIH1cbiAgICApO1xuXG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlUmVhY3RTY3JpcHRzQXBwKGFwcE5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBjb25zdCBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MgPSBzcGF3bihcbiAgICAgICducHgnLFxuICAgICAgWydjcmVhdGUtcmVhY3QtYXBwJywgYXBwTmFtZV0sXG4gICAgICB7IHN0ZGlvOiAnaW5oZXJpdCcgfVxuICAgICk7XG5cbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsb2dTcGFjZWQoYXJncykge1xuICBjb25zb2xlLmxvZygnJyk7XG4gIGNvbnNvbGUubG9nKExvZ0NvbG9yLCBhcmdzKTtcbiAgY29uc29sZS5sb2coJycpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdWZmaXgoc3RyOiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nKSB7XG4gIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5pbmRleE9mKHN1ZmZpeCkpO1xufVxuXG5mdW5jdGlvbiBleGNsdWRlT2JqZWN0S2V5cyhvYmplY3Q6IG9iamVjdCwgaWdub3JlZEtleXM6IHN0cmluZ1tdKTogb2JqZWN0IHtcbiAgbGV0IG5ld09iamVjdCA9IHsgLi4ub2JqZWN0IH07XG4gIGlnbm9yZWRLZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGRlbGV0ZSBuZXdPYmplY3Rba2V5XTtcbiAgfSk7XG4gIHJldHVybiBuZXdPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VWYWx1ZXNPZk9iamVjdChcbiAgb2JqZWN0OiBvYmplY3QsXG4gIHNlYXJjaDogc3RyaW5nLFxuICByZXBsYWNlOiBzdHJpbmdcbik6IG9iamVjdCB7XG4gIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyh7IGtleSB9KTtcbiAgICBjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIC8vIGNvbnNvbGUubG9nKHsgdmFsdWUgfSk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBuZXdPYmplY3Rba2V5XSA9IHZhbHVlLnJlcGxhY2UgPyB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgcmVwbGFjZSkgOiB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqZWN0O1xufVxuXG5mdW5jdGlvbiBwcmVmaXhPYmplY3Qob2JqZWN0OiBvYmplY3QsIHByZWZpeDogc3RyaW5nKTogb2JqZWN0IHtcbiAgbGV0IG5ld09iamVjdCA9IHt9O1xuICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIG5ld09iamVjdFtwcmVmaXggKyBrZXldID0gb2JqZWN0W2tleV07XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqZWN0O1xufVxuIl19