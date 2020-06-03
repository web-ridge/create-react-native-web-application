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

    var templateDir = path.dirname(require.main.filename) + '/template'; // console.log({ templateDir });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJMb2dDb2xvciIsInNwYXduIiwicmVxdWlyZSIsImZzIiwicGF0aCIsImFyZ3YiLCJoZWxwIiwib3B0aW9uIiwiYWxpYXMiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJleGl0IiwiYXBwIiwiYXBwTmFtZSIsImFwcE5hbWVXZWIiLCJsb2dTcGFjZWQiLCJQcm9taXNlIiwiYWxsIiwiY3JlYXRlUmVhY3ROYXRpdmVBcHAiLCJjcmVhdGVSZWFjdFNjcmlwdHNBcHAiLCJlcnJvciIsIndlYlBhY2thZ2VQYXRoIiwid2ViUGFja2FnZUZpbGUiLCJyZWFkRmlsZVN5bmMiLCJ3ZWJQYWNrYWdlSlNPTiIsIkpTT04iLCJwYXJzZSIsIndlYkRlcGVuZGVuY2llcyIsIk9iamVjdCIsImtleXMiLCJkZXBlbmRlbmNpZXMiLCJtYXAiLCJwYWNrYWdlTmFtZSIsInZlcnNpb24iLCJpc0RldiIsInJlYWN0TmF0aXZlUGFja2FnZVBhdGgiLCJyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlIiwicmVhY3ROYXRpdmVQYWNrYWdlSlNPTiIsIndlYlNjcmlwdHMiLCJyZXBsYWNlVmFsdWVzT2ZPYmplY3QiLCJwcmVmaXhPYmplY3QiLCJzY3JpcHRzIiwid2ViU3RhcnRDb21tYW5kIiwid2ViIiwibWVyZ2VkUGFja2FnZUpTT04iLCJleGNsdWRlT2JqZWN0S2V5cyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJpbnN0YWxsUGFja2FnZXMiLCJ0ZW1wbGF0ZURpciIsImRpcm5hbWUiLCJtYWluIiwiZmlsZW5hbWUiLCJjb3B5U3luYyIsInVubGlua1N5bmMiLCJyZW1vdmVTeW5jIiwicGFja2FnZXMiLCJkaXJlY3RvcnkiLCJpbnN0YWxsUGFja2FnZXNBZHZhbmNlZCIsImZpbHRlciIsInAiLCJkZXYiLCJyZXNvbHZlIiwicmVqZWN0Iiwiam9pbmVkUGFja2FnZXMiLCJjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MiLCJ1bmRlZmluZWQiLCJuIiwic3RkaW8iLCJvbiIsInJlc3BvbnNlIiwiYXJncyIsIm9iamVjdCIsImlnbm9yZWRLZXlzIiwibmV3T2JqZWN0IiwiZm9yRWFjaCIsImtleSIsInNlYXJjaCIsInJlcGxhY2UiLCJ2YWx1ZSIsInByZWZpeCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7Ozs7Ozs7Ozs7O0FBTUEsSUFBTUEsUUFBUSxHQUFHLFVBQWpCOztBQUVBLElBQU07QUFBRUMsRUFBQUE7QUFBRixJQUFZQyxPQUFPLENBQUMsZUFBRCxDQUF6Qjs7QUFDQSxJQUFNQyxFQUFFLEdBQUdELE9BQU8sQ0FBQyxVQUFELENBQWxCOztBQUNBLElBQU1FLElBQUksR0FBR0YsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsSUFBTUcsSUFBSSxHQUFHSCxPQUFPLENBQUMsT0FBRCxDQUFQLENBQ1ZJLElBRFUsR0FFVkMsTUFGVSxDQUVILE1BRkcsRUFFSztBQUNkQyxFQUFBQSxLQUFLLEVBQUUsR0FETztBQUVkQyxFQUFBQSxXQUFXLEVBQUUsaUJBRkM7QUFHZEMsRUFBQUEsSUFBSSxFQUFFO0FBSFEsQ0FGTCxFQU9WRixLQVBVLENBT0osTUFQSSxFQU9JLEdBUEosRUFPU0gsSUFQdEI7O0FBU0EsSUFBSSxDQUFDQSxJQUFJLENBQUNNLElBQVYsRUFBZ0I7QUFDZEMsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksb0RBQVo7QUFDQUMsRUFBQUEsT0FBTyxDQUFDQyxJQUFSO0FBQ0QsQyxDQUVEOzs7QUFDQUMsR0FBRzs7U0FFWUEsRzs7Ozs7MkJBQWYsYUFBcUI7QUFDbkIsUUFBTUMsT0FBTyxHQUFHWixJQUFJLENBQUNNLElBQXJCO0FBQ0EsUUFBTU8sVUFBVSxHQUFHRCxPQUFPLEdBQUcsaUNBQTdCO0FBRUFFLElBQUFBLFNBQVMsd0JBQ0VGLE9BREYsMkZBQVQ7O0FBT0EsUUFBSTtBQUNGLFlBQU1HLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLENBQ2hCQyxvQkFBb0IsQ0FBQ0wsT0FBRCxDQURKLEVBRWhCTSxxQkFBcUIsQ0FBQ0wsVUFBRCxDQUZMLENBQVosQ0FBTjtBQUlELEtBTEQsQ0FLRSxPQUFPTSxLQUFQLEVBQWM7QUFDZFosTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksdUNBQVosRUFBcUQ7QUFBRVcsUUFBQUE7QUFBRixPQUFyRDtBQUNEOztBQUVETCxJQUFBQSxTQUFTLENBQ1AsNkVBRE8sQ0FBVDtBQUlBLFFBQU1NLGNBQWMsR0FBR1AsVUFBVSxHQUFHLGVBQXBDO0FBQ0EsUUFBTVEsY0FBYyxHQUFHdkIsRUFBRSxDQUFDd0IsWUFBSCxDQUFnQkYsY0FBaEIsQ0FBdkI7QUFDQSxRQUFNRyxjQUFjLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixjQUFYLENBQXZCO0FBRUEsUUFBTUssZUFBOEIsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQ3JDTCxjQUFjLENBQUNNLFlBRHNCLEVBRXJDQyxHQUZxQyxDQUVoQ0MsV0FBRCxLQUFrQjtBQUN0QnpCLE1BQUFBLElBQUksRUFBRXlCLFdBRGdCO0FBRXRCQyxNQUFBQSxPQUFPLEVBQUVULGNBQWMsQ0FBQ00sWUFBZixDQUE0QkUsV0FBNUIsQ0FGYTtBQUd0QkUsTUFBQUEsS0FBSyxFQUFFO0FBSGUsS0FBbEIsQ0FGaUMsQ0FBdkM7QUFRQSxRQUFNQyxzQkFBc0IsR0FBR3RCLE9BQU8sR0FBRyxlQUF6QztBQUNBLFFBQU11QixzQkFBc0IsR0FBR3JDLEVBQUUsQ0FBQ3dCLFlBQUgsQ0FBZ0JZLHNCQUFoQixDQUEvQjtBQUNBLFFBQU1FLHNCQUFzQixHQUFHWixJQUFJLENBQUNDLEtBQUwsQ0FBV1Usc0JBQVgsQ0FBL0I7QUFFQSxRQUFJRSxVQUFVLEdBQUdDLHFCQUFxQixDQUNwQ0MsWUFBWSxDQUFDaEIsY0FBYyxDQUFDaUIsT0FBaEIsRUFBeUIsTUFBekIsQ0FEd0IsRUFFcEMsZUFGb0MsRUFHcEMsbUJBSG9DLENBQXRDLENBeENtQixDQThDbkI7QUFDQTs7QUFDQSxRQUFJQyxlQUFlLEdBQUdKLFVBQVUsQ0FBQyxXQUFELENBQWhDO0FBQ0EsV0FBT0EsVUFBVSxDQUFDLFdBQUQsQ0FBakIsQ0FqRG1CLENBa0RuQjs7QUFDQUEsSUFBQUEsVUFBVSxDQUFDSyxHQUFYLEdBQWlCRCxlQUFqQixDQW5EbUIsQ0FxRG5COztBQUVBLFFBQU1FLGlCQUFpQixpREFDbEJQLHNCQURrQixHQUdsQlEsaUJBQWlCLENBQUNyQixjQUFELEVBQWlCLENBQUMsY0FBRCxFQUFpQixTQUFqQixFQUE0QixNQUE1QixDQUFqQixDQUhDO0FBSXJCaUIsTUFBQUEsT0FBTyxrQ0FDRkosc0JBQXNCLENBQUNJLE9BRHJCLEdBRUZILFVBRkU7QUFKYyxNQUF2QixDQXZEbUIsQ0FpRW5COzs7QUFDQXZDLElBQUFBLEVBQUUsQ0FBQytDLGFBQUgsQ0FBaUJYLHNCQUFqQixFQUF5Q1YsSUFBSSxDQUFDc0IsU0FBTCxDQUFlSCxpQkFBZixDQUF6QyxFQWxFbUIsQ0FvRW5COztBQUNBLFVBQU1JLGVBQWUsQ0FDbkIsQ0FDRSxHQUFHckIsZUFETCxFQUVFO0FBQ0VwQixNQUFBQSxJQUFJLEVBQUU7QUFEUixLQUZGLEVBS0U7QUFDRUEsTUFBQUEsSUFBSSxFQUFFLG1CQURSO0FBRUUyQixNQUFBQSxLQUFLLEVBQUU7QUFGVCxLQUxGLEVBU0U7QUFDRTNCLE1BQUFBLElBQUksRUFBRSxlQURSO0FBRUUyQixNQUFBQSxLQUFLLEVBQUU7QUFGVCxLQVRGLEVBYUU7QUFDRTNCLE1BQUFBLElBQUksRUFBRSw2QkFEUjtBQUVFMkIsTUFBQUEsS0FBSyxFQUFFO0FBRlQsS0FiRixFQWlCRTtBQUNFM0IsTUFBQUEsSUFBSSxFQUFFLGNBRFI7QUFFRTJCLE1BQUFBLEtBQUssRUFBRTtBQUZULEtBakJGLEVBcUJFO0FBQUUzQixNQUFBQSxJQUFJLEVBQUUscUJBQVI7QUFBK0IyQixNQUFBQSxLQUFLLEVBQUU7QUFBdEMsS0FyQkYsRUFzQkU7QUFBRTNCLE1BQUFBLElBQUksRUFBRSxZQUFSO0FBQXNCMkIsTUFBQUEsS0FBSyxFQUFFO0FBQTdCLEtBdEJGLEVBdUJFO0FBQUUzQixNQUFBQSxJQUFJLEVBQUUscUJBQVI7QUFBK0IyQixNQUFBQSxLQUFLLEVBQUU7QUFBdEMsS0F2QkYsQ0FEbUIsRUEwQm5CckIsT0ExQm1CLENBQXJCLENBckVtQixDQWtHbkI7O0FBRUEsUUFBTW9DLFdBQVcsR0FBR2pELElBQUksQ0FBQ2tELE9BQUwsQ0FBYXBELE9BQU8sQ0FBQ3FELElBQVIsQ0FBYUMsUUFBMUIsSUFBc0MsV0FBMUQsQ0FwR21CLENBcUduQjs7QUFDQXJELElBQUFBLEVBQUUsQ0FBQ3NELFFBQUgsQ0FBWUosV0FBWixFQUF5QnBDLE9BQXpCO0FBQ0FkLElBQUFBLEVBQUUsQ0FBQ3NELFFBQUgsQ0FDRXZDLFVBQVUsR0FBRyx1QkFEZixFQUVFRCxPQUFPLEdBQUcsdUJBRlo7QUFJQWQsSUFBQUEsRUFBRSxDQUFDc0QsUUFBSCxDQUFZdkMsVUFBVSxHQUFHLFNBQXpCLEVBQW9DRCxPQUFPLEdBQUcsU0FBOUM7QUFDQWQsSUFBQUEsRUFBRSxDQUFDdUQsVUFBSCxDQUFjekMsT0FBTyxHQUFHLFNBQXhCO0FBQ0FkLElBQUFBLEVBQUUsQ0FBQ3dELFVBQUgsQ0FBY3pDLFVBQWQ7QUFFQUMsSUFBQUEsU0FBUyxDQUFDLG9CQUFELENBQVQ7QUFDQUEsSUFBQUEsU0FBUywwRUFDb0RGLE9BRHBELDJEQUFUO0FBT0QsRzs7OztTQUVjbUMsZTs7Ozs7dUNBQWYsV0FBK0JRLFFBQS9CLEVBQXdEQyxTQUF4RCxFQUEyRTtBQUN6RSxVQUFNQyx1QkFBdUIsQ0FDM0JGLFFBQVEsQ0FBQ0csTUFBVCxDQUFpQkMsQ0FBRCxJQUFPQSxDQUFDLENBQUMxQixLQUFGLEtBQVksSUFBbkMsQ0FEMkIsRUFFM0J1QixTQUYyQixFQUczQixJQUgyQixDQUE3QjtBQUtBLFVBQU1DLHVCQUF1QixDQUMzQkYsUUFBUSxDQUFDRyxNQUFULENBQWlCQyxDQUFELElBQU8sQ0FBQ0EsQ0FBQyxDQUFDMUIsS0FBMUIsQ0FEMkIsRUFFM0J1QixTQUYyQixFQUczQixLQUgyQixDQUE3QjtBQUtELEc7Ozs7U0FDY0MsdUI7Ozs7OytDQUFmLFdBQ0VGLFFBREYsRUFFRUMsU0FGRixFQUdFSSxHQUhGLEVBSWdCO0FBQ2QsV0FBTyxJQUFJN0MsT0FBSixDQUFZLENBQUM4QyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBTUMsY0FBYyxHQUFHUixRQUFRLENBQUN6QixHQUFULENBQ3BCNkIsQ0FBRCxJQUFPQSxDQUFDLENBQUNyRCxJQUFGLElBQVVxRCxDQUFDLENBQUMzQixPQUFGLGNBQWdCMkIsQ0FBQyxDQUFDM0IsT0FBbEIsTUFBVixDQURjLENBQXZCLENBRHNDLENBSXRDOztBQUNBLFVBQU1nQyx3QkFBd0IsR0FBR3BFLEtBQUssQ0FDcEMsTUFEb0MsRUFFcEMsQ0FDRSxPQURGLEVBRUU0RCxTQUZGLEVBR0UsS0FIRixFQUlFLEdBQUdPLGNBSkwsRUFLRUgsR0FBRyxHQUFHLE9BQUgsR0FBYUssU0FMbEIsRUFNRVAsTUFORixDQU1VUSxDQUFELElBQU8sQ0FBQyxDQUFDQSxDQU5sQixDQUZvQyxFQVNwQztBQUFFQyxRQUFBQSxLQUFLLEVBQUU7QUFBVCxPQVRvQyxDQUF0QztBQVlBSCxNQUFBQSx3QkFBd0IsQ0FBQ0ksRUFBekIsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBVWpELEtBQVYsRUFBaUI7QUFDcEQyQyxRQUFBQSxNQUFNLENBQUMzQyxLQUFELENBQU47QUFDRCxPQUZEO0FBR0E2QyxNQUFBQSx3QkFBd0IsQ0FBQ0ksRUFBekIsQ0FBNEIsTUFBNUIsRUFBb0MsVUFBVUMsUUFBVixFQUFvQjtBQUN0RFIsUUFBQUEsT0FBTyxDQUFDUSxRQUFELENBQVA7QUFDRCxPQUZEO0FBR0QsS0F2Qk0sQ0FBUDtBQXdCRCxHOzs7O1NBRWNwRCxvQjs7Ozs7NENBQWYsV0FBb0NMLE9BQXBDLEVBQW1FO0FBQ2pFLFdBQU8sSUFBSUcsT0FBSixDQUFZLENBQUM4QyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBTUUsd0JBQXdCLEdBQUdwRSxLQUFLLENBQ3BDLEtBRG9DLEVBRXBDLENBQUMsY0FBRCxFQUFpQixNQUFqQixFQUF5QmdCLE9BQXpCLENBRm9DLEVBR3BDO0FBQUV1RCxRQUFBQSxLQUFLLEVBQUU7QUFBVCxPQUhvQyxDQUF0QztBQU1BSCxNQUFBQSx3QkFBd0IsQ0FBQ0ksRUFBekIsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBVWpELEtBQVYsRUFBaUI7QUFDcEQyQyxRQUFBQSxNQUFNLENBQUMzQyxLQUFELENBQU47QUFDRCxPQUZEO0FBR0E2QyxNQUFBQSx3QkFBd0IsQ0FBQ0ksRUFBekIsQ0FBNEIsTUFBNUIsRUFBb0MsVUFBVUMsUUFBVixFQUFvQjtBQUN0RFIsUUFBQUEsT0FBTyxDQUFDUSxRQUFELENBQVA7QUFDRCxPQUZEO0FBR0QsS0FiTSxDQUFQO0FBY0QsRzs7OztTQUVjbkQscUI7Ozs7OzZDQUFmLFdBQXFDTixPQUFyQyxFQUFvRTtBQUNsRSxXQUFPLElBQUlHLE9BQUosQ0FBaUIsVUFBVThDLE9BQVYsRUFBbUJDLE1BQW5CLEVBQTJCO0FBQ2pELFVBQU1FLHdCQUF3QixHQUFHcEUsS0FBSyxDQUNwQyxLQURvQyxFQUVwQyxDQUFDLGtCQUFELEVBQXFCZ0IsT0FBckIsQ0FGb0MsRUFHcEM7QUFBRXVELFFBQUFBLEtBQUssRUFBRTtBQUFULE9BSG9DLENBQXRDO0FBTUFILE1BQUFBLHdCQUF3QixDQUFDSSxFQUF6QixDQUE0QixPQUE1QixFQUFxQyxVQUFVakQsS0FBVixFQUFpQjtBQUNwRDJDLFFBQUFBLE1BQU0sQ0FBQzNDLEtBQUQsQ0FBTjtBQUNELE9BRkQ7QUFHQTZDLE1BQUFBLHdCQUF3QixDQUFDSSxFQUF6QixDQUE0QixNQUE1QixFQUFvQyxVQUFVQyxRQUFWLEVBQW9CO0FBQ3REUixRQUFBQSxPQUFPLENBQUNRLFFBQUQsQ0FBUDtBQUNELE9BRkQ7QUFHRCxLQWJNLENBQVA7QUFjRCxHOzs7O0FBRUQsU0FBU3ZELFNBQVQsQ0FBbUJ3RCxJQUFuQixFQUF5QjtBQUN2Qi9ELEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEVBQVo7QUFDQUQsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVliLFFBQVosRUFBc0IyRSxJQUF0QjtBQUNBL0QsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksRUFBWjtBQUNEOztBQUVELFNBQVNvQyxpQkFBVCxDQUEyQjJCLE1BQTNCLEVBQTJDQyxXQUEzQyxFQUEwRTtBQUN4RSxNQUFJQyxTQUFTLHFCQUFRRixNQUFSLENBQWI7O0FBQ0FDLEVBQUFBLFdBQVcsQ0FBQ0UsT0FBWixDQUFvQixVQUFVQyxHQUFWLEVBQWU7QUFDakMsV0FBT0YsU0FBUyxDQUFDRSxHQUFELENBQWhCO0FBQ0QsR0FGRDtBQUdBLFNBQU9GLFNBQVA7QUFDRDs7QUFFRCxTQUFTbkMscUJBQVQsQ0FDRWlDLE1BREYsRUFFRUssTUFGRixFQUdFQyxPQUhGLEVBSVU7QUFDUixNQUFJSixTQUFTLEdBQUcsRUFBaEI7QUFDQTlDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZMkMsTUFBWixFQUFvQkcsT0FBcEIsQ0FBNkJDLEdBQUQsSUFBUztBQUNuQztBQUNBLFFBQU1HLEtBQUssR0FBR1AsTUFBTSxDQUFDSSxHQUFELENBQXBCLENBRm1DLENBR25DOztBQUNBLFFBQUlHLEtBQUosRUFBVztBQUNUTCxNQUFBQSxTQUFTLENBQUNFLEdBQUQsQ0FBVCxHQUFpQkcsS0FBSyxDQUFDRCxPQUFOLEdBQWdCQyxLQUFLLENBQUNELE9BQU4sQ0FBY0QsTUFBZCxFQUFzQkMsT0FBdEIsQ0FBaEIsR0FBaURDLEtBQWxFO0FBQ0Q7QUFDRixHQVBEO0FBUUEsU0FBT0wsU0FBUDtBQUNEOztBQUVELFNBQVNsQyxZQUFULENBQXNCZ0MsTUFBdEIsRUFBc0NRLE1BQXRDLEVBQThEO0FBQzVELE1BQUlOLFNBQVMsR0FBRyxFQUFoQjtBQUNBOUMsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVkyQyxNQUFaLEVBQW9CRyxPQUFwQixDQUE2QkMsR0FBRCxJQUFTO0FBQ25DRixJQUFBQSxTQUFTLENBQUNNLE1BQU0sR0FBR0osR0FBVixDQUFULEdBQTBCSixNQUFNLENBQUNJLEdBQUQsQ0FBaEM7QUFDRCxHQUZEO0FBR0EsU0FBT0YsU0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuJ3VzZSBzdHJpY3QnO1xuaW50ZXJmYWNlIFBhY2thZ2VUeXBlIHtcbiAgbmFtZTogc3RyaW5nO1xuICB2ZXJzaW9uPzogc3RyaW5nO1xuICBpc0Rldj86IGJvb2xlYW47XG59XG5jb25zdCBMb2dDb2xvciA9ICdcXHgxYlszMm0nO1xuXG5jb25zdCB7IHNwYXduIH0gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuY29uc3QgYXJndiA9IHJlcXVpcmUoJ3lhcmdzJylcbiAgLmhlbHAoKVxuICAub3B0aW9uKCduYW1lJywge1xuICAgIGFsaWFzOiAnbicsXG4gICAgZGVzY3JpcHRpb246ICdOYW1lIG9mIHRoZSBhcHAnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICB9KVxuICAuYWxpYXMoJ2hlbHAnLCAnaCcpLmFyZ3Y7XG5cbmlmICghYXJndi5uYW1lKSB7XG4gIGNvbnNvbGUubG9nKCdZb3Ugc2hvdWxkIHNwZWNpZnkgdGhlIG5hbWUgb2YgdGhlIGFwcCB3aXRoIC0tbmFtZScpO1xuICBwcm9jZXNzLmV4aXQoKTtcbn1cblxuLy8gcnVuIHRoZSBhcHAgOylcbmFwcCgpO1xuXG5hc3luYyBmdW5jdGlvbiBhcHAoKSB7XG4gIGNvbnN0IGFwcE5hbWUgPSBhcmd2Lm5hbWU7XG4gIGNvbnN0IGFwcE5hbWVXZWIgPSBhcHBOYW1lICsgJy13ZWItd2lsbC1iZS1kZWxldGVkLWFmdGVyd2FyZHMnO1xuXG4gIGxvZ1NwYWNlZChgXG4gIENyZWF0aW5nICR7YXBwTmFtZX0sIGJyb3VnaHQgdG8geW91IGJ5IHdlYlJpZGdlLlxuXG4gIFBsZWFzZSB3YWl0IHRpbGwgZXZlcnl0aGluZyBpcyBmaW5pc2hlZCA6KVxuICBcbiAgYCk7XG5cbiAgdHJ5IHtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBjcmVhdGVSZWFjdE5hdGl2ZUFwcChhcHBOYW1lKSxcbiAgICAgIGNyZWF0ZVJlYWN0U2NyaXB0c0FwcChhcHBOYW1lV2ViKSxcbiAgICBdKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IGNyZWF0ZSBSZWFjdCBOYXRpdmUgcHJvamVjdCcsIHsgZXJyb3IgfSk7XG4gIH1cblxuICBsb2dTcGFjZWQoXG4gICAgXCJDcmVhdGVkIHR3byBwcm9qZWN0cyBpbiB0d28gZGlyZWN0b3JpZXMuIExldCdzIG1lcmdlIHRoZW0gdG8gb25lIHByb2plY3QgOylcIlxuICApO1xuXG4gIGNvbnN0IHdlYlBhY2thZ2VQYXRoID0gYXBwTmFtZVdlYiArICcvcGFja2FnZS5qc29uJztcbiAgY29uc3Qgd2ViUGFja2FnZUZpbGUgPSBmcy5yZWFkRmlsZVN5bmMod2ViUGFja2FnZVBhdGgpO1xuICBjb25zdCB3ZWJQYWNrYWdlSlNPTiA9IEpTT04ucGFyc2Uod2ViUGFja2FnZUZpbGUpO1xuXG4gIGNvbnN0IHdlYkRlcGVuZGVuY2llczogUGFja2FnZVR5cGVbXSA9IE9iamVjdC5rZXlzKFxuICAgIHdlYlBhY2thZ2VKU09OLmRlcGVuZGVuY2llc1xuICApLm1hcCgocGFja2FnZU5hbWUpID0+ICh7XG4gICAgbmFtZTogcGFja2FnZU5hbWUsXG4gICAgdmVyc2lvbjogd2ViUGFja2FnZUpTT04uZGVwZW5kZW5jaWVzW3BhY2thZ2VOYW1lXSxcbiAgICBpc0RldjogZmFsc2UsXG4gIH0pKTtcblxuICBjb25zdCByZWFjdE5hdGl2ZVBhY2thZ2VQYXRoID0gYXBwTmFtZSArICcvcGFja2FnZS5qc29uJztcbiAgY29uc3QgcmVhY3ROYXRpdmVQYWNrYWdlRmlsZSA9IGZzLnJlYWRGaWxlU3luYyhyZWFjdE5hdGl2ZVBhY2thZ2VQYXRoKTtcbiAgY29uc3QgcmVhY3ROYXRpdmVQYWNrYWdlSlNPTiA9IEpTT04ucGFyc2UocmVhY3ROYXRpdmVQYWNrYWdlRmlsZSk7XG5cbiAgbGV0IHdlYlNjcmlwdHMgPSByZXBsYWNlVmFsdWVzT2ZPYmplY3QoXG4gICAgcHJlZml4T2JqZWN0KHdlYlBhY2thZ2VKU09OLnNjcmlwdHMsICd3ZWI6JyksXG4gICAgJ3JlYWN0LXNjcmlwdHMnLFxuICAgICdyZWFjdC1hcHAtcmV3aXJlZCdcbiAgKTtcblxuICAvLyBtb3JlIGxpa2UgeWFybiBhbmRyb2lkLCB5YXJuIGlvcywgeWFybiB3ZWJcbiAgLy9AdHMtaWdub3JlXG4gIGxldCB3ZWJTdGFydENvbW1hbmQgPSB3ZWJTY3JpcHRzWyd3ZWI6c3RhcnQnXTtcbiAgZGVsZXRlIHdlYlNjcmlwdHNbJ3dlYjpzdGFydCddO1xuICAvL0B0cy1pZ25vcmVcbiAgd2ViU2NyaXB0cy53ZWIgPSB3ZWJTdGFydENvbW1hbmQ7XG5cbiAgLy8gY29uc29sZS5sb2coeyB3ZWJTY3JpcHRzIH0pO1xuXG4gIGNvbnN0IG1lcmdlZFBhY2thZ2VKU09OID0ge1xuICAgIC4uLnJlYWN0TmF0aXZlUGFja2FnZUpTT04sXG4gICAgLy8gd2UncmUgZ29ubmEgbWVyZ2Ugc2NyaXB0cyBhbmQgZGVwZW5kZW5jaWVzIG91cnNlbGYgOilcbiAgICAuLi5leGNsdWRlT2JqZWN0S2V5cyh3ZWJQYWNrYWdlSlNPTiwgWydkZXBlbmRlbmNpZXMnLCAnc2NyaXB0cycsICduYW1lJ10pLFxuICAgIHNjcmlwdHM6IHtcbiAgICAgIC4uLnJlYWN0TmF0aXZlUGFja2FnZUpTT04uc2NyaXB0cyxcbiAgICAgIC4uLndlYlNjcmlwdHMsXG4gICAgfSxcbiAgfTtcblxuICAvLyB3cml0ZSBtZXJnZWQgcGFja2FnZS5qc29uIGRvd25cbiAgZnMud3JpdGVGaWxlU3luYyhyZWFjdE5hdGl2ZVBhY2thZ2VQYXRoLCBKU09OLnN0cmluZ2lmeShtZXJnZWRQYWNrYWdlSlNPTikpO1xuXG4gIC8vIGluc3RhbGwgd2ViIHBhY2thZ2VzIHRvIG5hdGl2ZSBwcm9qZWN0XG4gIGF3YWl0IGluc3RhbGxQYWNrYWdlcyhcbiAgICBbXG4gICAgICAuLi53ZWJEZXBlbmRlbmNpZXMsXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdyZWFjdC1uYXRpdmUtd2ViJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdyZWFjdC1hcHAtcmV3aXJlZCcsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2N1c3RvbWl6ZS1jcmEnLFxuICAgICAgICBpc0RldjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdjdXN0b21pemUtY3JhLXJlYWN0LXJlZnJlc2gnLFxuICAgICAgICBpc0RldjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdAdHlwZXMvcmVhY3QnLFxuICAgICAgICBpc0RldjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7IG5hbWU6ICdAdHlwZXMvcmVhY3QtbmF0aXZlJywgaXNEZXY6IHRydWUgfSxcbiAgICAgIHsgbmFtZTogJ3R5cGVzY3JpcHQnLCBpc0RldjogdHJ1ZSB9LFxuICAgICAgeyBuYW1lOiAnYmFiZWwtcGx1Z2luLWltcG9ydCcsIGlzRGV2OiB0cnVlIH0sXG4gICAgXSxcbiAgICBhcHBOYW1lXG4gICk7XG5cbiAgLy8gY29weSB0ZW1wbGF0ZSBmaWxlc1xuXG4gIGNvbnN0IHRlbXBsYXRlRGlyID0gcGF0aC5kaXJuYW1lKHJlcXVpcmUubWFpbi5maWxlbmFtZSkgKyAnL3RlbXBsYXRlJztcbiAgLy8gY29uc29sZS5sb2coeyB0ZW1wbGF0ZURpciB9KTtcbiAgZnMuY29weVN5bmModGVtcGxhdGVEaXIsIGFwcE5hbWUpO1xuICBmcy5jb3B5U3luYyhcbiAgICBhcHBOYW1lV2ViICsgJy9zcmMvc2VydmljZVdvcmtlci5qcycsXG4gICAgYXBwTmFtZSArICcvc3JjL3NlcnZpY2VXb3JrZXIuanMnXG4gICk7XG4gIGZzLmNvcHlTeW5jKGFwcE5hbWVXZWIgKyAnL3B1YmxpYycsIGFwcE5hbWUgKyAnL3B1YmxpYycpO1xuICBmcy51bmxpbmtTeW5jKGFwcE5hbWUgKyAnL0FwcC5qcycpO1xuICBmcy5yZW1vdmVTeW5jKGFwcE5hbWVXZWIpO1xuXG4gIGxvZ1NwYWNlZChcIlllYWghISBXZSdyZSBkb25lIVwiKTtcbiAgbG9nU3BhY2VkKGBcbiAgU3RhcnQgeW91ciBhcHAgd2l0aCBieSBnb2luZyB0byB0aGUgY3JlYXRlZCBkaXJlY3Rvcnk6ICdjZCAke2FwcE5hbWV9J1xuXG4gICAgeWFybiBhbmRyb2lkXG4gICAgeWFybiBpb3NcbiAgICB5YXJuIHdlYlxuICBgKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5zdGFsbFBhY2thZ2VzKHBhY2thZ2VzOiBQYWNrYWdlVHlwZVtdLCBkaXJlY3Rvcnk6IHN0cmluZykge1xuICBhd2FpdCBpbnN0YWxsUGFja2FnZXNBZHZhbmNlZChcbiAgICBwYWNrYWdlcy5maWx0ZXIoKHApID0+IHAuaXNEZXYgPT09IHRydWUpLFxuICAgIGRpcmVjdG9yeSxcbiAgICB0cnVlXG4gICk7XG4gIGF3YWl0IGluc3RhbGxQYWNrYWdlc0FkdmFuY2VkKFxuICAgIHBhY2thZ2VzLmZpbHRlcigocCkgPT4gIXAuaXNEZXYpLFxuICAgIGRpcmVjdG9yeSxcbiAgICBmYWxzZVxuICApO1xufVxuYXN5bmMgZnVuY3Rpb24gaW5zdGFsbFBhY2thZ2VzQWR2YW5jZWQoXG4gIHBhY2thZ2VzOiBQYWNrYWdlVHlwZVtdLFxuICBkaXJlY3Rvcnk6IHN0cmluZyxcbiAgZGV2OiBib29sZWFuXG4pOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGpvaW5lZFBhY2thZ2VzID0gcGFja2FnZXMubWFwKFxuICAgICAgKHApID0+IHAubmFtZSArIChwLnZlcnNpb24gPyBgQCR7cC52ZXJzaW9ufWAgOiBgYClcbiAgICApO1xuICAgIC8vIGNvbnNvbGUubG9nKHsgam9pbmVkUGFja2FnZXMgfSk7XG4gICAgY29uc3QgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzID0gc3Bhd24oXG4gICAgICAneWFybicsXG4gICAgICBbXG4gICAgICAgICctLWN3ZCcsXG4gICAgICAgIGRpcmVjdG9yeSxcbiAgICAgICAgJ2FkZCcsXG4gICAgICAgIC4uLmpvaW5lZFBhY2thZ2VzLFxuICAgICAgICBkZXYgPyAnLS1kZXYnIDogdW5kZWZpbmVkLFxuICAgICAgXS5maWx0ZXIoKG4pID0+ICEhbiksXG4gICAgICB7IHN0ZGlvOiAnaW5oZXJpdCcgfVxuICAgICk7XG5cbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVSZWFjdE5hdGl2ZUFwcChhcHBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2VzcyA9IHNwYXduKFxuICAgICAgJ25weCcsXG4gICAgICBbJ3JlYWN0LW5hdGl2ZScsICdpbml0JywgYXBwTmFtZV0sXG4gICAgICB7IHN0ZGlvOiAnaW5oZXJpdCcgfVxuICAgICk7XG5cbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVSZWFjdFNjcmlwdHNBcHAoYXBwTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGNvbnN0IGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2VzcyA9IHNwYXduKFxuICAgICAgJ25weCcsXG4gICAgICBbJ2NyZWF0ZS1yZWFjdC1hcHAnLCBhcHBOYW1lXSxcbiAgICAgIHsgc3RkaW86ICdpbmhlcml0JyB9XG4gICAgKTtcblxuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvZ1NwYWNlZChhcmdzKSB7XG4gIGNvbnNvbGUubG9nKCcnKTtcbiAgY29uc29sZS5sb2coTG9nQ29sb3IsIGFyZ3MpO1xuICBjb25zb2xlLmxvZygnJyk7XG59XG5cbmZ1bmN0aW9uIGV4Y2x1ZGVPYmplY3RLZXlzKG9iamVjdDogb2JqZWN0LCBpZ25vcmVkS2V5czogc3RyaW5nW10pOiBvYmplY3Qge1xuICBsZXQgbmV3T2JqZWN0ID0geyAuLi5vYmplY3QgfTtcbiAgaWdub3JlZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgZGVsZXRlIG5ld09iamVjdFtrZXldO1xuICB9KTtcbiAgcmV0dXJuIG5ld09iamVjdDtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZVZhbHVlc09mT2JqZWN0KFxuICBvYmplY3Q6IG9iamVjdCxcbiAgc2VhcmNoOiBzdHJpbmcsXG4gIHJlcGxhY2U6IHN0cmluZ1xuKTogb2JqZWN0IHtcbiAgbGV0IG5ld09iamVjdCA9IHt9O1xuICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIC8vIGNvbnNvbGUubG9nKHsga2V5IH0pO1xuICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgLy8gY29uc29sZS5sb2coeyB2YWx1ZSB9KTtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIG5ld09iamVjdFtrZXldID0gdmFsdWUucmVwbGFjZSA/IHZhbHVlLnJlcGxhY2Uoc2VhcmNoLCByZXBsYWNlKSA6IHZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBuZXdPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHByZWZpeE9iamVjdChvYmplY3Q6IG9iamVjdCwgcHJlZml4OiBzdHJpbmcpOiBvYmplY3Qge1xuICBsZXQgbmV3T2JqZWN0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgbmV3T2JqZWN0W3ByZWZpeCArIGtleV0gPSBvYmplY3Rba2V5XTtcbiAgfSk7XG4gIHJldHVybiBuZXdPYmplY3Q7XG59XG4iXX0=