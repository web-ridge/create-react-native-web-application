#!/usr/bin/env node
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var LogColor = '\x1b[32m';

var _require = require('child_process'),
    spawn = _require.spawn;

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
  _app = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var appName, appNameWeb, webPackagePath, webPackageFile, webPackageJSON, webDependencies, reactNativePackagePath, reactNativePackageFile, reactNativePackageJSON, webScripts, webStartCommand, mergedPackageJSON, templateDir;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            appName = argv.name;
            appNameWeb = appName + '-web-will-be-deleted-afterwards';
            logSpaced("\n  Creating ".concat(appName, ", brought to you by webRidge.\n\n  Please wait till everything is finished :)\n  \n  "));
            _context.prev = 3;
            _context.next = 6;
            return Promise.all([createReactNativeApp(appName), createReactScriptsApp(appNameWeb)]);

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            console.log('Could not create React Native project', {
              error: _context.t0
            });

          case 11:
            logSpaced("Created two projects in two directories. Let's merge them to one project ;)");
            webPackagePath = appNameWeb + '/package.json';
            webPackageFile = fs.readFileSync(webPackagePath);
            webPackageJSON = JSON.parse(webPackageFile);
            webDependencies = Object.keys(webPackageJSON.dependencies).map(function (packageName) {
              return {
                name: packageName,
                version: webPackageJSON.dependencies[packageName],
                isDev: false
              };
            });
            reactNativePackagePath = appName + '/package.json';
            reactNativePackageFile = fs.readFileSync(reactNativePackagePath);
            reactNativePackageJSON = JSON.parse(reactNativePackageFile);
            webScripts = replaceValuesOfObject(prefixObject(webPackageJSON.scripts, 'web:'), 'react-scripts', 'react-app-rewired'); // more like yarn android, yarn ios, yarn web
            //@ts-ignore

            webStartCommand = webScripts['web:start'];
            delete webScripts['web:start']; //@ts-ignore

            webScripts.web = webStartCommand;
            console.log({
              webScripts: webScripts
            });
            mergedPackageJSON = _objectSpread(_objectSpread(_objectSpread({}, reactNativePackageJSON), excludeObjectKeys(webPackageJSON, ['dependencies', 'scripts', 'name'])), {}, {
              scripts: _objectSpread(_objectSpread({}, reactNativePackageJSON.scripts), webScripts)
            }); // write merged package.json down

            fs.writeFileSync(reactNativePackagePath, JSON.stringify(mergedPackageJSON)); // install web packages to native project

            _context.next = 28;
            return installPackages([].concat(_toConsumableArray(webDependencies), [{
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
            }]), appName);

          case 28:
            // copy template files
            templateDir = path.dirname(require.main.filename) + '/template';
            console.log({
              templateDir: templateDir
            });
            fs.copySync(templateDir, appName);
            fs.copySync(appNameWeb + '/src/serviceWorker.js', appName + '/src/serviceWorker.js');
            fs.copySync(appNameWeb + '/public', appName + '/public');
            fs.unlinkSync(appName + '/App.js');
            fs.removeSync(appNameWeb);
            logSpaced("Yeah!! We're done!");
            logSpaced("\n  Start your app with by going to the created directory: 'cd ".concat(appName, "'\n\n    yarn android\n    yarn ios\n    yarn web\n  "));

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 8]]);
  }));
  return _app.apply(this, arguments);
}

function installPackages(_x, _x2) {
  return _installPackages.apply(this, arguments);
}

function _installPackages() {
  _installPackages = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(packages, directory) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return installPackagesAdvanced(packages.filter(function (_package) {
              return _package.isDev === true;
            }), directory, true);

          case 2:
            _context2.next = 4;
            return installPackagesAdvanced(packages.filter(function (_package2) {
              return !_package2.isDev;
            }), directory, false);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _installPackages.apply(this, arguments);
}

function installPackagesAdvanced(_x3, _x4, _x5) {
  return _installPackagesAdvanced.apply(this, arguments);
}

function _installPackagesAdvanced() {
  _installPackagesAdvanced = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(packages, directory, dev) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              var joinedPackages = packages.map(function (_package3) {
                return _package3.name + (_package3.version ? "@".concat(_package3.version) : "");
              });
              console.log({
                joinedPackages: joinedPackages
              });
              var createReactNativeProcess = spawn('yarn', ['--cwd', directory, 'add'].concat(_toConsumableArray(joinedPackages), [dev ? '--dev' : undefined]).filter(function (n) {
                return !!n;
              }), {
                stdio: 'inherit'
              });
              createReactNativeProcess.on('error', function (error) {
                reject(error);
              });
              createReactNativeProcess.on('exit', function (response) {
                resolve(response);
              });
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _installPackagesAdvanced.apply(this, arguments);
}

function createReactNativeApp(_x6) {
  return _createReactNativeApp.apply(this, arguments);
}

function _createReactNativeApp() {
  _createReactNativeApp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(appName) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              var createReactNativeProcess = spawn('npx', ['react-native', 'init', appName], {
                stdio: 'inherit'
              });
              createReactNativeProcess.on('error', function (error) {
                reject(error);
              });
              createReactNativeProcess.on('exit', function (response) {
                resolve(response);
              });
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _createReactNativeApp.apply(this, arguments);
}

function createReactScriptsApp(_x7) {
  return _createReactScriptsApp.apply(this, arguments);
}

function _createReactScriptsApp() {
  _createReactScriptsApp = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(appName) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", new Promise(function (resolve, reject) {
              var createReactNativeProcess = spawn('npx', ['create-react-app', appName], {
                stdio: 'inherit'
              });
              createReactNativeProcess.on('error', function (error) {
                reject(error);
              });
              createReactNativeProcess.on('exit', function (response) {
                resolve(response);
              });
            }));

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
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
  Object.keys(object).forEach(function (key) {
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
  Object.keys(object).forEach(function (key) {
    newObject[prefix + key] = object[key];
  });
  return newObject;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJMb2dDb2xvciIsInJlcXVpcmUiLCJzcGF3biIsImZzIiwicGF0aCIsImFyZ3YiLCJoZWxwIiwib3B0aW9uIiwiYWxpYXMiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJleGl0IiwiYXBwIiwiYXBwTmFtZSIsImFwcE5hbWVXZWIiLCJsb2dTcGFjZWQiLCJQcm9taXNlIiwiYWxsIiwiY3JlYXRlUmVhY3ROYXRpdmVBcHAiLCJjcmVhdGVSZWFjdFNjcmlwdHNBcHAiLCJlcnJvciIsIndlYlBhY2thZ2VQYXRoIiwid2ViUGFja2FnZUZpbGUiLCJyZWFkRmlsZVN5bmMiLCJ3ZWJQYWNrYWdlSlNPTiIsIkpTT04iLCJwYXJzZSIsIndlYkRlcGVuZGVuY2llcyIsIk9iamVjdCIsImtleXMiLCJkZXBlbmRlbmNpZXMiLCJtYXAiLCJwYWNrYWdlTmFtZSIsInZlcnNpb24iLCJpc0RldiIsInJlYWN0TmF0aXZlUGFja2FnZVBhdGgiLCJyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlIiwicmVhY3ROYXRpdmVQYWNrYWdlSlNPTiIsIndlYlNjcmlwdHMiLCJyZXBsYWNlVmFsdWVzT2ZPYmplY3QiLCJwcmVmaXhPYmplY3QiLCJzY3JpcHRzIiwid2ViU3RhcnRDb21tYW5kIiwid2ViIiwibWVyZ2VkUGFja2FnZUpTT04iLCJleGNsdWRlT2JqZWN0S2V5cyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJpbnN0YWxsUGFja2FnZXMiLCJ0ZW1wbGF0ZURpciIsImRpcm5hbWUiLCJtYWluIiwiZmlsZW5hbWUiLCJjb3B5U3luYyIsInVubGlua1N5bmMiLCJyZW1vdmVTeW5jIiwicGFja2FnZXMiLCJkaXJlY3RvcnkiLCJpbnN0YWxsUGFja2FnZXNBZHZhbmNlZCIsImZpbHRlciIsInBhY2thZ2UiLCJkZXYiLCJyZXNvbHZlIiwicmVqZWN0Iiwiam9pbmVkUGFja2FnZXMiLCJjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MiLCJ1bmRlZmluZWQiLCJuIiwic3RkaW8iLCJvbiIsInJlc3BvbnNlIiwiYXJncyIsIm9iamVjdCIsImlnbm9yZWRLZXlzIiwibmV3T2JqZWN0IiwiZm9yRWFjaCIsImtleSIsInNlYXJjaCIsInJlcGxhY2UiLCJ2YWx1ZSIsInByZWZpeCJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxJQUFNQSxRQUFRLEdBQUcsVUFBakI7O2VBRWtCQyxPQUFPLENBQUMsZUFBRCxDO0lBQWpCQyxLLFlBQUFBLEs7O0FBQ1IsSUFBTUMsRUFBRSxHQUFHRixPQUFPLENBQUMsVUFBRCxDQUFsQjs7QUFDQSxJQUFNRyxJQUFJLEdBQUdILE9BQU8sQ0FBQyxNQUFELENBQXBCOztBQUNBLElBQU1JLElBQUksR0FBR0osT0FBTyxDQUFDLE9BQUQsQ0FBUCxDQUNWSyxJQURVLEdBRVZDLE1BRlUsQ0FFSCxNQUZHLEVBRUs7QUFDZEMsRUFBQUEsS0FBSyxFQUFFLEdBRE87QUFFZEMsRUFBQUEsV0FBVyxFQUFFLGlCQUZDO0FBR2RDLEVBQUFBLElBQUksRUFBRTtBQUhRLENBRkwsRUFPVkYsS0FQVSxDQU9KLE1BUEksRUFPSSxHQVBKLEVBT1NILElBUHRCOztBQVNBLElBQUksQ0FBQ0EsSUFBSSxDQUFDTSxJQUFWLEVBQWdCO0FBQ2RDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLG9EQUFaO0FBQ0FDLEVBQUFBLE9BQU8sQ0FBQ0MsSUFBUjtBQUNELEMsQ0FFRDs7O0FBQ0FDLEdBQUc7O1NBRVlBLEc7Ozs7O2lFQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNRQyxZQUFBQSxPQURSLEdBQ2tCWixJQUFJLENBQUNNLElBRHZCO0FBRVFPLFlBQUFBLFVBRlIsR0FFcUJELE9BQU8sR0FBRyxpQ0FGL0I7QUFJRUUsWUFBQUEsU0FBUyx3QkFDRUYsT0FERiwyRkFBVDtBQUpGO0FBQUE7QUFBQSxtQkFZVUcsT0FBTyxDQUFDQyxHQUFS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QUdFQyxPQUhGLEVBSVU7QUFDUixNQUFJSixTQUFTLEdBQUcsRUFBaEI7QUFDQTlDLEVBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZMkMsTUFBWixFQUFvQkcsT0FBcEIsQ0FBNEIsVUFBQ0MsR0FBRCxFQUFTO0FBQ25DO0FBQ0EsUUFBTUcsS0FBSyxHQUFHUCxNQUFNLENBQUNJLEdBQUQsQ0FBcEIsQ0FGbUMsQ0FHbkM7O0FBQ0EsUUFBSUcsS0FBSixFQUFXO0FBQ1RMLE1BQUFBLFNBQVMsQ0FBQ0UsR0FBRCxDQUFULEdBQWlCRyxLQUFLLENBQUNELE9BQU4sR0FBZ0JDLEtBQUssQ0FBQ0QsT0FBTixDQUFjRCxNQUFkLEVBQXNCQyxPQUF0QixDQUFoQixHQUFpREMsS0FBbEU7QUFDRDtBQUNGLEdBUEQ7QUFRQSxTQUFPTCxTQUFQO0FBQ0Q7O0FBRUQsU0FBU2xDLFlBQVQsQ0FBc0JnQyxNQUF0QixFQUFzQ1EsTUFBdEMsRUFBOEQ7QUFDNUQsTUFBSU4sU0FBUyxHQUFHLEVBQWhCO0FBQ0E5QyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWTJDLE1BQVosRUFBb0JHLE9BQXBCLENBQTRCLFVBQUNDLEdBQUQsRUFBUztBQUNuQ0YsSUFBQUEsU0FBUyxDQUFDTSxNQUFNLEdBQUdKLEdBQVYsQ0FBVCxHQUEwQkosTUFBTSxDQUFDSSxHQUFELENBQWhDO0FBQ0QsR0FGRDtBQUdBLFNBQU9GLFNBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmludGVyZmFjZSBQYWNrYWdlVHlwZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdmVyc2lvbj86IHN0cmluZztcbiAgaXNEZXY/OiBib29sZWFuO1xufVxuY29uc3QgTG9nQ29sb3IgPSAnXFx4MWJbMzJtJztcblxuY29uc3QgeyBzcGF3biB9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGFyZ3YgPSByZXF1aXJlKCd5YXJncycpXG4gIC5oZWxwKClcbiAgLm9wdGlvbignbmFtZScsIHtcbiAgICBhbGlhczogJ24nLFxuICAgIGRlc2NyaXB0aW9uOiAnTmFtZSBvZiB0aGUgYXBwJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgfSlcbiAgLmFsaWFzKCdoZWxwJywgJ2gnKS5hcmd2O1xuXG5pZiAoIWFyZ3YubmFtZSkge1xuICBjb25zb2xlLmxvZygnWW91IHNob3VsZCBzcGVjaWZ5IHRoZSBuYW1lIG9mIHRoZSBhcHAgd2l0aCAtLW5hbWUnKTtcbiAgcHJvY2Vzcy5leGl0KCk7XG59XG5cbi8vIHJ1biB0aGUgYXBwIDspXG5hcHAoKTtcblxuYXN5bmMgZnVuY3Rpb24gYXBwKCkge1xuICBjb25zdCBhcHBOYW1lID0gYXJndi5uYW1lO1xuICBjb25zdCBhcHBOYW1lV2ViID0gYXBwTmFtZSArICctd2ViLXdpbGwtYmUtZGVsZXRlZC1hZnRlcndhcmRzJztcblxuICBsb2dTcGFjZWQoYFxuICBDcmVhdGluZyAke2FwcE5hbWV9LCBicm91Z2h0IHRvIHlvdSBieSB3ZWJSaWRnZS5cblxuICBQbGVhc2Ugd2FpdCB0aWxsIGV2ZXJ5dGhpbmcgaXMgZmluaXNoZWQgOilcbiAgXG4gIGApO1xuXG4gIHRyeSB7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgY3JlYXRlUmVhY3ROYXRpdmVBcHAoYXBwTmFtZSksXG4gICAgICBjcmVhdGVSZWFjdFNjcmlwdHNBcHAoYXBwTmFtZVdlYiksXG4gICAgXSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5sb2coJ0NvdWxkIG5vdCBjcmVhdGUgUmVhY3QgTmF0aXZlIHByb2plY3QnLCB7IGVycm9yIH0pO1xuICB9XG5cbiAgbG9nU3BhY2VkKFxuICAgIFwiQ3JlYXRlZCB0d28gcHJvamVjdHMgaW4gdHdvIGRpcmVjdG9yaWVzLiBMZXQncyBtZXJnZSB0aGVtIHRvIG9uZSBwcm9qZWN0IDspXCJcbiAgKTtcblxuICBjb25zdCB3ZWJQYWNrYWdlUGF0aCA9IGFwcE5hbWVXZWIgKyAnL3BhY2thZ2UuanNvbic7XG4gIGNvbnN0IHdlYlBhY2thZ2VGaWxlID0gZnMucmVhZEZpbGVTeW5jKHdlYlBhY2thZ2VQYXRoKTtcbiAgY29uc3Qgd2ViUGFja2FnZUpTT04gPSBKU09OLnBhcnNlKHdlYlBhY2thZ2VGaWxlKTtcblxuICBjb25zdCB3ZWJEZXBlbmRlbmNpZXM6IFBhY2thZ2VUeXBlW10gPSBPYmplY3Qua2V5cyhcbiAgICB3ZWJQYWNrYWdlSlNPTi5kZXBlbmRlbmNpZXNcbiAgKS5tYXAoKHBhY2thZ2VOYW1lKSA9PiAoe1xuICAgIG5hbWU6IHBhY2thZ2VOYW1lLFxuICAgIHZlcnNpb246IHdlYlBhY2thZ2VKU09OLmRlcGVuZGVuY2llc1twYWNrYWdlTmFtZV0sXG4gICAgaXNEZXY6IGZhbHNlLFxuICB9KSk7XG5cbiAgY29uc3QgcmVhY3ROYXRpdmVQYWNrYWdlUGF0aCA9IGFwcE5hbWUgKyAnL3BhY2thZ2UuanNvbic7XG4gIGNvbnN0IHJlYWN0TmF0aXZlUGFja2FnZUZpbGUgPSBmcy5yZWFkRmlsZVN5bmMocmVhY3ROYXRpdmVQYWNrYWdlUGF0aCk7XG4gIGNvbnN0IHJlYWN0TmF0aXZlUGFja2FnZUpTT04gPSBKU09OLnBhcnNlKHJlYWN0TmF0aXZlUGFja2FnZUZpbGUpO1xuXG4gIGxldCB3ZWJTY3JpcHRzID0gcmVwbGFjZVZhbHVlc09mT2JqZWN0KFxuICAgIHByZWZpeE9iamVjdCh3ZWJQYWNrYWdlSlNPTi5zY3JpcHRzLCAnd2ViOicpLFxuICAgICdyZWFjdC1zY3JpcHRzJyxcbiAgICAncmVhY3QtYXBwLXJld2lyZWQnXG4gICk7XG5cbiAgLy8gbW9yZSBsaWtlIHlhcm4gYW5kcm9pZCwgeWFybiBpb3MsIHlhcm4gd2ViXG4gIC8vQHRzLWlnbm9yZVxuICBsZXQgd2ViU3RhcnRDb21tYW5kID0gd2ViU2NyaXB0c1snd2ViOnN0YXJ0J107XG4gIGRlbGV0ZSB3ZWJTY3JpcHRzWyd3ZWI6c3RhcnQnXTtcbiAgLy9AdHMtaWdub3JlXG4gIHdlYlNjcmlwdHMud2ViID0gd2ViU3RhcnRDb21tYW5kO1xuXG4gIGNvbnNvbGUubG9nKHsgd2ViU2NyaXB0cyB9KTtcblxuICBjb25zdCBtZXJnZWRQYWNrYWdlSlNPTiA9IHtcbiAgICAuLi5yZWFjdE5hdGl2ZVBhY2thZ2VKU09OLFxuICAgIC8vIHdlJ3JlIGdvbm5hIG1lcmdlIHNjcmlwdHMgYW5kIGRlcGVuZGVuY2llcyBvdXJzZWxmIDopXG4gICAgLi4uZXhjbHVkZU9iamVjdEtleXMod2ViUGFja2FnZUpTT04sIFsnZGVwZW5kZW5jaWVzJywgJ3NjcmlwdHMnLCAnbmFtZSddKSxcbiAgICBzY3JpcHRzOiB7XG4gICAgICAuLi5yZWFjdE5hdGl2ZVBhY2thZ2VKU09OLnNjcmlwdHMsXG4gICAgICAuLi53ZWJTY3JpcHRzLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gd3JpdGUgbWVyZ2VkIHBhY2thZ2UuanNvbiBkb3duXG4gIGZzLndyaXRlRmlsZVN5bmMocmVhY3ROYXRpdmVQYWNrYWdlUGF0aCwgSlNPTi5zdHJpbmdpZnkobWVyZ2VkUGFja2FnZUpTT04pKTtcblxuICAvLyBpbnN0YWxsIHdlYiBwYWNrYWdlcyB0byBuYXRpdmUgcHJvamVjdFxuICBhd2FpdCBpbnN0YWxsUGFja2FnZXMoXG4gICAgW1xuICAgICAgLi4ud2ViRGVwZW5kZW5jaWVzLFxuICAgICAge1xuICAgICAgICBuYW1lOiAncmVhY3QtbmF0aXZlLXdlYicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAncmVhY3QtYXBwLXJld2lyZWQnLFxuICAgICAgICBpc0RldjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdjdXN0b21pemUtY3JhJyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnY3VzdG9taXplLWNyYS1yZWFjdC1yZWZyZXNoJyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnQHR5cGVzL3JlYWN0JyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAgeyBuYW1lOiAnQHR5cGVzL3JlYWN0LW5hdGl2ZScsIGlzRGV2OiB0cnVlIH0sXG4gICAgICB7IG5hbWU6ICd0eXBlc2NyaXB0JywgaXNEZXY6IHRydWUgfSxcbiAgICAgIHsgbmFtZTogJ2JhYmVsLXBsdWdpbi1pbXBvcnQnLCBpc0RldjogdHJ1ZSB9LFxuICAgIF0sXG4gICAgYXBwTmFtZVxuICApO1xuXG4gIC8vIGNvcHkgdGVtcGxhdGUgZmlsZXNcblxuICBjb25zdCB0ZW1wbGF0ZURpciA9IHBhdGguZGlybmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpICsgJy90ZW1wbGF0ZSc7XG4gIGNvbnNvbGUubG9nKHsgdGVtcGxhdGVEaXIgfSk7XG4gIGZzLmNvcHlTeW5jKHRlbXBsYXRlRGlyLCBhcHBOYW1lKTtcbiAgZnMuY29weVN5bmMoXG4gICAgYXBwTmFtZVdlYiArICcvc3JjL3NlcnZpY2VXb3JrZXIuanMnLFxuICAgIGFwcE5hbWUgKyAnL3NyYy9zZXJ2aWNlV29ya2VyLmpzJ1xuICApO1xuICBmcy5jb3B5U3luYyhhcHBOYW1lV2ViICsgJy9wdWJsaWMnLCBhcHBOYW1lICsgJy9wdWJsaWMnKTtcbiAgZnMudW5saW5rU3luYyhhcHBOYW1lICsgJy9BcHAuanMnKTtcbiAgZnMucmVtb3ZlU3luYyhhcHBOYW1lV2ViKTtcblxuICBsb2dTcGFjZWQoXCJZZWFoISEgV2UncmUgZG9uZSFcIik7XG4gIGxvZ1NwYWNlZChgXG4gIFN0YXJ0IHlvdXIgYXBwIHdpdGggYnkgZ29pbmcgdG8gdGhlIGNyZWF0ZWQgZGlyZWN0b3J5OiAnY2QgJHthcHBOYW1lfSdcblxuICAgIHlhcm4gYW5kcm9pZFxuICAgIHlhcm4gaW9zXG4gICAgeWFybiB3ZWJcbiAgYCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlcyhwYWNrYWdlczogUGFja2FnZVR5cGVbXSwgZGlyZWN0b3J5OiBzdHJpbmcpIHtcbiAgYXdhaXQgaW5zdGFsbFBhY2thZ2VzQWR2YW5jZWQoXG4gICAgcGFja2FnZXMuZmlsdGVyKChwYWNrYWdlKSA9PiBwYWNrYWdlLmlzRGV2ID09PSB0cnVlKSxcbiAgICBkaXJlY3RvcnksXG4gICAgdHJ1ZVxuICApO1xuICBhd2FpdCBpbnN0YWxsUGFja2FnZXNBZHZhbmNlZChcbiAgICBwYWNrYWdlcy5maWx0ZXIoKHBhY2thZ2UpID0+ICFwYWNrYWdlLmlzRGV2KSxcbiAgICBkaXJlY3RvcnksXG4gICAgZmFsc2VcbiAgKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGluc3RhbGxQYWNrYWdlc0FkdmFuY2VkKFxuICBwYWNrYWdlczogUGFja2FnZVR5cGVbXSxcbiAgZGlyZWN0b3J5OiBzdHJpbmcsXG4gIGRldjogYm9vbGVhblxuKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBqb2luZWRQYWNrYWdlcyA9IHBhY2thZ2VzLm1hcChcbiAgICAgIChwYWNrYWdlKSA9PiBwYWNrYWdlLm5hbWUgKyAocGFja2FnZS52ZXJzaW9uID8gYEAke3BhY2thZ2UudmVyc2lvbn1gIDogYGApXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyh7IGpvaW5lZFBhY2thZ2VzIH0pO1xuICAgIGNvbnN0IGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2VzcyA9IHNwYXduKFxuICAgICAgJ3lhcm4nLFxuICAgICAgW1xuICAgICAgICAnLS1jd2QnLFxuICAgICAgICBkaXJlY3RvcnksXG4gICAgICAgICdhZGQnLFxuICAgICAgICAuLi5qb2luZWRQYWNrYWdlcyxcbiAgICAgICAgZGV2ID8gJy0tZGV2JyA6IHVuZGVmaW5lZCxcbiAgICAgIF0uZmlsdGVyKChuKSA9PiAhIW4pLFxuICAgICAgeyBzdGRpbzogJ2luaGVyaXQnIH1cbiAgICApO1xuXG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlUmVhY3ROYXRpdmVBcHAoYXBwTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MgPSBzcGF3bihcbiAgICAgICducHgnLFxuICAgICAgWydyZWFjdC1uYXRpdmUnLCAnaW5pdCcsIGFwcE5hbWVdLFxuICAgICAgeyBzdGRpbzogJ2luaGVyaXQnIH1cbiAgICApO1xuXG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlUmVhY3RTY3JpcHRzQXBwKGFwcE5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBjb25zdCBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MgPSBzcGF3bihcbiAgICAgICducHgnLFxuICAgICAgWydjcmVhdGUtcmVhY3QtYXBwJywgYXBwTmFtZV0sXG4gICAgICB7IHN0ZGlvOiAnaW5oZXJpdCcgfVxuICAgICk7XG5cbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICByZWplY3QoZXJyb3IpO1xuICAgIH0pO1xuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXhpdCcsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBsb2dTcGFjZWQoYXJncykge1xuICBjb25zb2xlLmxvZygnJyk7XG4gIGNvbnNvbGUubG9nKExvZ0NvbG9yLCBhcmdzKTtcbiAgY29uc29sZS5sb2coJycpO1xufVxuXG5mdW5jdGlvbiBleGNsdWRlT2JqZWN0S2V5cyhvYmplY3Q6IG9iamVjdCwgaWdub3JlZEtleXM6IHN0cmluZ1tdKTogb2JqZWN0IHtcbiAgbGV0IG5ld09iamVjdCA9IHsgLi4ub2JqZWN0IH07XG4gIGlnbm9yZWRLZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGRlbGV0ZSBuZXdPYmplY3Rba2V5XTtcbiAgfSk7XG4gIHJldHVybiBuZXdPYmplY3Q7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VWYWx1ZXNPZk9iamVjdChcbiAgb2JqZWN0OiBvYmplY3QsXG4gIHNlYXJjaDogc3RyaW5nLFxuICByZXBsYWNlOiBzdHJpbmdcbik6IG9iamVjdCB7XG4gIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAvLyBjb25zb2xlLmxvZyh7IGtleSB9KTtcbiAgICBjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIC8vIGNvbnNvbGUubG9nKHsgdmFsdWUgfSk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBuZXdPYmplY3Rba2V5XSA9IHZhbHVlLnJlcGxhY2UgPyB2YWx1ZS5yZXBsYWNlKHNlYXJjaCwgcmVwbGFjZSkgOiB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqZWN0O1xufVxuXG5mdW5jdGlvbiBwcmVmaXhPYmplY3Qob2JqZWN0OiBvYmplY3QsIHByZWZpeDogc3RyaW5nKTogb2JqZWN0IHtcbiAgbGV0IG5ld09iamVjdCA9IHt9O1xuICBPYmplY3Qua2V5cyhvYmplY3QpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIG5ld09iamVjdFtwcmVmaXggKyBrZXldID0gb2JqZWN0W2tleV07XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqZWN0O1xufVxuIl19