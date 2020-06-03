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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJMb2dDb2xvciIsInJlcXVpcmUiLCJzcGF3biIsImZzIiwicGF0aCIsImFyZ3YiLCJoZWxwIiwib3B0aW9uIiwiYWxpYXMiLCJkZXNjcmlwdGlvbiIsInR5cGUiLCJuYW1lIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJleGl0IiwiYXBwIiwiYXBwTmFtZSIsImFwcE5hbWVXZWIiLCJsb2dTcGFjZWQiLCJQcm9taXNlIiwiYWxsIiwiY3JlYXRlUmVhY3ROYXRpdmVBcHAiLCJjcmVhdGVSZWFjdFNjcmlwdHNBcHAiLCJlcnJvciIsIndlYlBhY2thZ2VQYXRoIiwid2ViUGFja2FnZUZpbGUiLCJyZWFkRmlsZVN5bmMiLCJ3ZWJQYWNrYWdlSlNPTiIsIkpTT04iLCJwYXJzZSIsIndlYkRlcGVuZGVuY2llcyIsIk9iamVjdCIsImtleXMiLCJkZXBlbmRlbmNpZXMiLCJtYXAiLCJwYWNrYWdlTmFtZSIsInZlcnNpb24iLCJpc0RldiIsInJlYWN0TmF0aXZlUGFja2FnZVBhdGgiLCJyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlIiwicmVhY3ROYXRpdmVQYWNrYWdlSlNPTiIsIndlYlNjcmlwdHMiLCJyZXBsYWNlVmFsdWVzT2ZPYmplY3QiLCJwcmVmaXhPYmplY3QiLCJzY3JpcHRzIiwid2ViU3RhcnRDb21tYW5kIiwid2ViIiwibWVyZ2VkUGFja2FnZUpTT04iLCJleGNsdWRlT2JqZWN0S2V5cyIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiLCJpbnN0YWxsUGFja2FnZXMiLCJ0ZW1wbGF0ZURpciIsImRpcm5hbWUiLCJtYWluIiwiZmlsZW5hbWUiLCJjb3B5U3luYyIsInVubGlua1N5bmMiLCJyZW1vdmVTeW5jIiwicGFja2FnZXMiLCJkaXJlY3RvcnkiLCJpbnN0YWxsUGFja2FnZXNBZHZhbmNlZCIsImZpbHRlciIsInBhY2thZ2UiLCJkZXYiLCJyZXNvbHZlIiwicmVqZWN0Iiwiam9pbmVkUGFja2FnZXMiLCJjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MiLCJ1bmRlZmluZWQiLCJuIiwic3RkaW8iLCJvbiIsInJlc3BvbnNlIiwiYXJncyIsIm9iamVjdCIsImlnbm9yZWRLZXlzIiwibmV3T2JqZWN0IiwiZm9yRWFjaCIsImtleSIsInNlYXJjaCIsInJlcGxhY2UiLCJ2YWx1ZSIsInByZWZpeCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsSUFBTUEsUUFBUSxHQUFHLFVBQWpCOztlQUVrQkMsT0FBTyxDQUFDLGVBQUQsQztJQUFqQkMsSyxZQUFBQSxLOztBQUNSLElBQU1DLEVBQUUsR0FBR0YsT0FBTyxDQUFDLFVBQUQsQ0FBbEI7O0FBQ0EsSUFBTUcsSUFBSSxHQUFHSCxPQUFPLENBQUMsTUFBRCxDQUFwQjs7QUFDQSxJQUFNSSxJQUFJLEdBQUdKLE9BQU8sQ0FBQyxPQUFELENBQVAsQ0FDVkssSUFEVSxHQUVWQyxNQUZVLENBRUgsTUFGRyxFQUVLO0FBQ2RDLEVBQUFBLEtBQUssRUFBRSxHQURPO0FBRWRDLEVBQUFBLFdBQVcsRUFBRSxpQkFGQztBQUdkQyxFQUFBQSxJQUFJLEVBQUU7QUFIUSxDQUZMLEVBT1ZGLEtBUFUsQ0FPSixNQVBJLEVBT0ksR0FQSixFQU9TSCxJQVB0Qjs7QUFTQSxJQUFJLENBQUNBLElBQUksQ0FBQ00sSUFBVixFQUFnQjtBQUNkQyxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxvREFBWjtBQUNBQyxFQUFBQSxPQUFPLENBQUNDLElBQVI7QUFDRCxDLENBRUQ7OztBQUNBQyxHQUFHOztTQUVZQSxHOzs7OztpRUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDUUMsWUFBQUEsT0FEUixHQUNrQlosSUFBSSxDQUFDTSxJQUR2QjtBQUVRTyxZQUFBQSxVQUZSLEdBRXFCRCxPQUFPLEdBQUcsaUNBRi9CO0FBSUVFLFlBQUFBLFNBQVMsd0JBQ0VGLE9BREYsMkZBQVQ7QUFKRjtBQUFBO0FBQUEsbUJBWVVHLE9BQU8sQ0FBQ0MsR0FBUixDQUFZ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T0FIRixFQUlVO0FBQ1IsTUFBSUosU0FBUyxHQUFHLEVBQWhCO0FBQ0E5QyxFQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWTJDLE1BQVosRUFBb0JHLE9BQXBCLENBQTRCLFVBQUNDLEdBQUQsRUFBUztBQUNuQztBQUNBLFFBQU1HLEtBQUssR0FBR1AsTUFBTSxDQUFDSSxHQUFELENBQXBCLENBRm1DLENBR25DOztBQUNBLFFBQUlHLEtBQUosRUFBVztBQUNUTCxNQUFBQSxTQUFTLENBQUNFLEdBQUQsQ0FBVCxHQUFpQkcsS0FBSyxDQUFDRCxPQUFOLEdBQWdCQyxLQUFLLENBQUNELE9BQU4sQ0FBY0QsTUFBZCxFQUFzQkMsT0FBdEIsQ0FBaEIsR0FBaURDLEtBQWxFO0FBQ0Q7QUFDRixHQVBEO0FBUUEsU0FBT0wsU0FBUDtBQUNEOztBQUVELFNBQVNsQyxZQUFULENBQXNCZ0MsTUFBdEIsRUFBc0NRLE1BQXRDLEVBQThEO0FBQzVELE1BQUlOLFNBQVMsR0FBRyxFQUFoQjtBQUNBOUMsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVkyQyxNQUFaLEVBQW9CRyxPQUFwQixDQUE0QixVQUFDQyxHQUFELEVBQVM7QUFDbkNGLElBQUFBLFNBQVMsQ0FBQ00sTUFBTSxHQUFHSixHQUFWLENBQVQsR0FBMEJKLE1BQU0sQ0FBQ0ksR0FBRCxDQUFoQztBQUNELEdBRkQ7QUFHQSxTQUFPRixTQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgUGFja2FnZVR5cGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHZlcnNpb24/OiBzdHJpbmc7XG4gIGlzRGV2PzogYm9vbGVhbjtcbn1cbmNvbnN0IExvZ0NvbG9yID0gJ1xceDFiWzMybSc7XG5cbmNvbnN0IHsgc3Bhd24gfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKTtcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBhcmd2ID0gcmVxdWlyZSgneWFyZ3MnKVxuICAuaGVscCgpXG4gIC5vcHRpb24oJ25hbWUnLCB7XG4gICAgYWxpYXM6ICduJyxcbiAgICBkZXNjcmlwdGlvbjogJ05hbWUgb2YgdGhlIGFwcCcsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gIH0pXG4gIC5hbGlhcygnaGVscCcsICdoJykuYXJndjtcblxuaWYgKCFhcmd2Lm5hbWUpIHtcbiAgY29uc29sZS5sb2coJ1lvdSBzaG91bGQgc3BlY2lmeSB0aGUgbmFtZSBvZiB0aGUgYXBwIHdpdGggLS1uYW1lJyk7XG4gIHByb2Nlc3MuZXhpdCgpO1xufVxuXG4vLyBydW4gdGhlIGFwcCA7KVxuYXBwKCk7XG5cbmFzeW5jIGZ1bmN0aW9uIGFwcCgpIHtcbiAgY29uc3QgYXBwTmFtZSA9IGFyZ3YubmFtZTtcbiAgY29uc3QgYXBwTmFtZVdlYiA9IGFwcE5hbWUgKyAnLXdlYi13aWxsLWJlLWRlbGV0ZWQtYWZ0ZXJ3YXJkcyc7XG5cbiAgbG9nU3BhY2VkKGBcbiAgQ3JlYXRpbmcgJHthcHBOYW1lfSwgYnJvdWdodCB0byB5b3UgYnkgd2ViUmlkZ2UuXG5cbiAgUGxlYXNlIHdhaXQgdGlsbCBldmVyeXRoaW5nIGlzIGZpbmlzaGVkIDopXG4gIFxuICBgKTtcblxuICB0cnkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgIGNyZWF0ZVJlYWN0TmF0aXZlQXBwKGFwcE5hbWUpLFxuICAgICAgY3JlYXRlUmVhY3RTY3JpcHRzQXBwKGFwcE5hbWVXZWIpLFxuICAgIF0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUubG9nKCdDb3VsZCBub3QgY3JlYXRlIFJlYWN0IE5hdGl2ZSBwcm9qZWN0JywgeyBlcnJvciB9KTtcbiAgfVxuXG4gIGxvZ1NwYWNlZChcbiAgICBcIkNyZWF0ZWQgdHdvIHByb2plY3RzIGluIHR3byBkaXJlY3Rvcmllcy4gTGV0J3MgbWVyZ2UgdGhlbSB0byBvbmUgcHJvamVjdCA7KVwiXG4gICk7XG5cbiAgY29uc3Qgd2ViUGFja2FnZVBhdGggPSBhcHBOYW1lV2ViICsgJy9wYWNrYWdlLmpzb24nO1xuICBjb25zdCB3ZWJQYWNrYWdlRmlsZSA9IGZzLnJlYWRGaWxlU3luYyh3ZWJQYWNrYWdlUGF0aCk7XG4gIGNvbnN0IHdlYlBhY2thZ2VKU09OID0gSlNPTi5wYXJzZSh3ZWJQYWNrYWdlRmlsZSk7XG5cbiAgY29uc3Qgd2ViRGVwZW5kZW5jaWVzOiBQYWNrYWdlVHlwZVtdID0gT2JqZWN0LmtleXMoXG4gICAgd2ViUGFja2FnZUpTT04uZGVwZW5kZW5jaWVzXG4gICkubWFwKChwYWNrYWdlTmFtZSkgPT4gKHtcbiAgICBuYW1lOiBwYWNrYWdlTmFtZSxcbiAgICB2ZXJzaW9uOiB3ZWJQYWNrYWdlSlNPTi5kZXBlbmRlbmNpZXNbcGFja2FnZU5hbWVdLFxuICAgIGlzRGV2OiBmYWxzZSxcbiAgfSkpO1xuXG4gIGNvbnN0IHJlYWN0TmF0aXZlUGFja2FnZVBhdGggPSBhcHBOYW1lICsgJy9wYWNrYWdlLmpzb24nO1xuICBjb25zdCByZWFjdE5hdGl2ZVBhY2thZ2VGaWxlID0gZnMucmVhZEZpbGVTeW5jKHJlYWN0TmF0aXZlUGFja2FnZVBhdGgpO1xuICBjb25zdCByZWFjdE5hdGl2ZVBhY2thZ2VKU09OID0gSlNPTi5wYXJzZShyZWFjdE5hdGl2ZVBhY2thZ2VGaWxlKTtcblxuICBsZXQgd2ViU2NyaXB0cyA9IHJlcGxhY2VWYWx1ZXNPZk9iamVjdChcbiAgICBwcmVmaXhPYmplY3Qod2ViUGFja2FnZUpTT04uc2NyaXB0cywgJ3dlYjonKSxcbiAgICAncmVhY3Qtc2NyaXB0cycsXG4gICAgJ3JlYWN0LWFwcC1yZXdpcmVkJ1xuICApO1xuXG4gIC8vIG1vcmUgbGlrZSB5YXJuIGFuZHJvaWQsIHlhcm4gaW9zLCB5YXJuIHdlYlxuICAvL0B0cy1pZ25vcmVcbiAgbGV0IHdlYlN0YXJ0Q29tbWFuZCA9IHdlYlNjcmlwdHNbJ3dlYjpzdGFydCddO1xuICBkZWxldGUgd2ViU2NyaXB0c1snd2ViOnN0YXJ0J107XG4gIC8vQHRzLWlnbm9yZVxuICB3ZWJTY3JpcHRzLndlYiA9IHdlYlN0YXJ0Q29tbWFuZDtcblxuICBjb25zb2xlLmxvZyh7IHdlYlNjcmlwdHMgfSk7XG5cbiAgY29uc3QgbWVyZ2VkUGFja2FnZUpTT04gPSB7XG4gICAgLi4ucmVhY3ROYXRpdmVQYWNrYWdlSlNPTixcbiAgICAvLyB3ZSdyZSBnb25uYSBtZXJnZSBzY3JpcHRzIGFuZCBkZXBlbmRlbmNpZXMgb3Vyc2VsZiA6KVxuICAgIC4uLmV4Y2x1ZGVPYmplY3RLZXlzKHdlYlBhY2thZ2VKU09OLCBbJ2RlcGVuZGVuY2llcycsICdzY3JpcHRzJywgJ25hbWUnXSksXG4gICAgc2NyaXB0czoge1xuICAgICAgLi4ucmVhY3ROYXRpdmVQYWNrYWdlSlNPTi5zY3JpcHRzLFxuICAgICAgLi4ud2ViU2NyaXB0cyxcbiAgICB9LFxuICB9O1xuXG4gIC8vIHdyaXRlIG1lcmdlZCBwYWNrYWdlLmpzb24gZG93blxuICBmcy53cml0ZUZpbGVTeW5jKHJlYWN0TmF0aXZlUGFja2FnZVBhdGgsIEpTT04uc3RyaW5naWZ5KG1lcmdlZFBhY2thZ2VKU09OKSk7XG5cbiAgLy8gaW5zdGFsbCB3ZWIgcGFja2FnZXMgdG8gbmF0aXZlIHByb2plY3RcbiAgYXdhaXQgaW5zdGFsbFBhY2thZ2VzKFxuICAgIFtcbiAgICAgIC4uLndlYkRlcGVuZGVuY2llcyxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3JlYWN0LW5hdGl2ZS13ZWInLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3JlYWN0LWFwcC1yZXdpcmVkJyxcbiAgICAgICAgaXNEZXY6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnY3VzdG9taXplLWNyYScsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2N1c3RvbWl6ZS1jcmEtcmVhY3QtcmVmcmVzaCcsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ0B0eXBlcy9yZWFjdCcsXG4gICAgICAgIGlzRGV2OiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHsgbmFtZTogJ0B0eXBlcy9yZWFjdC1uYXRpdmUnLCBpc0RldjogdHJ1ZSB9LFxuICAgICAgeyBuYW1lOiAndHlwZXNjcmlwdCcsIGlzRGV2OiB0cnVlIH0sXG4gICAgICB7IG5hbWU6ICdiYWJlbC1wbHVnaW4taW1wb3J0JywgaXNEZXY6IHRydWUgfSxcbiAgICBdLFxuICAgIGFwcE5hbWVcbiAgKTtcblxuICAvLyBjb3B5IHRlbXBsYXRlIGZpbGVzXG5cbiAgY29uc3QgdGVtcGxhdGVEaXIgPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5tYWluLmZpbGVuYW1lKSArICcvdGVtcGxhdGUnO1xuICBjb25zb2xlLmxvZyh7IHRlbXBsYXRlRGlyIH0pO1xuICBmcy5jb3B5U3luYyh0ZW1wbGF0ZURpciwgYXBwTmFtZSk7XG4gIGZzLmNvcHlTeW5jKFxuICAgIGFwcE5hbWVXZWIgKyAnL3NyYy9zZXJ2aWNlV29ya2VyLmpzJyxcbiAgICBhcHBOYW1lICsgJy9zcmMvc2VydmljZVdvcmtlci5qcydcbiAgKTtcbiAgZnMuY29weVN5bmMoYXBwTmFtZVdlYiArICcvcHVibGljJywgYXBwTmFtZSArICcvcHVibGljJyk7XG4gIGZzLnVubGlua1N5bmMoYXBwTmFtZSArICcvQXBwLmpzJyk7XG4gIGZzLnJlbW92ZVN5bmMoYXBwTmFtZVdlYik7XG5cbiAgbG9nU3BhY2VkKFwiWWVhaCEhIFdlJ3JlIGRvbmUhXCIpO1xuICBsb2dTcGFjZWQoYFxuICBTdGFydCB5b3VyIGFwcCB3aXRoIGJ5IGdvaW5nIHRvIHRoZSBjcmVhdGVkIGRpcmVjdG9yeTogJ2NkICR7YXBwTmFtZX0nXG5cbiAgICB5YXJuIGFuZHJvaWRcbiAgICB5YXJuIGlvc1xuICAgIHlhcm4gd2ViXG4gIGApO1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbnN0YWxsUGFja2FnZXMocGFja2FnZXM6IFBhY2thZ2VUeXBlW10sIGRpcmVjdG9yeTogc3RyaW5nKSB7XG4gIGF3YWl0IGluc3RhbGxQYWNrYWdlc0FkdmFuY2VkKFxuICAgIHBhY2thZ2VzLmZpbHRlcigocGFja2FnZSkgPT4gcGFja2FnZS5pc0RldiA9PT0gdHJ1ZSksXG4gICAgZGlyZWN0b3J5LFxuICAgIHRydWVcbiAgKTtcbiAgYXdhaXQgaW5zdGFsbFBhY2thZ2VzQWR2YW5jZWQoXG4gICAgcGFja2FnZXMuZmlsdGVyKChwYWNrYWdlKSA9PiAhcGFja2FnZS5pc0RldiksXG4gICAgZGlyZWN0b3J5LFxuICAgIGZhbHNlXG4gICk7XG59XG5hc3luYyBmdW5jdGlvbiBpbnN0YWxsUGFja2FnZXNBZHZhbmNlZChcbiAgcGFja2FnZXM6IFBhY2thZ2VUeXBlW10sXG4gIGRpcmVjdG9yeTogc3RyaW5nLFxuICBkZXY6IGJvb2xlYW5cbik6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgam9pbmVkUGFja2FnZXMgPSBwYWNrYWdlcy5tYXAoXG4gICAgICAocGFja2FnZSkgPT4gcGFja2FnZS5uYW1lICsgKHBhY2thZ2UudmVyc2lvbiA/IGBAJHtwYWNrYWdlLnZlcnNpb259YCA6IGBgKVxuICAgICk7XG4gICAgY29uc29sZS5sb2coeyBqb2luZWRQYWNrYWdlcyB9KTtcbiAgICBjb25zdCBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3MgPSBzcGF3bihcbiAgICAgICd5YXJuJyxcbiAgICAgIFtcbiAgICAgICAgJy0tY3dkJyxcbiAgICAgICAgZGlyZWN0b3J5LFxuICAgICAgICAnYWRkJyxcbiAgICAgICAgLi4uam9pbmVkUGFja2FnZXMsXG4gICAgICAgIGRldiA/ICctLWRldicgOiB1bmRlZmluZWQsXG4gICAgICBdLmZpbHRlcigobikgPT4gISFuKSxcbiAgICAgIHsgc3RkaW86ICdpbmhlcml0JyB9XG4gICAgKTtcblxuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVJlYWN0TmF0aXZlQXBwKGFwcE5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzID0gc3Bhd24oXG4gICAgICAnbnB4JyxcbiAgICAgIFsncmVhY3QtbmF0aXZlJywgJ2luaXQnLCBhcHBOYW1lXSxcbiAgICAgIHsgc3RkaW86ICdpbmhlcml0JyB9XG4gICAgKTtcblxuICAgIGNyZWF0ZVJlYWN0TmF0aXZlUHJvY2Vzcy5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHJlamVjdChlcnJvcik7XG4gICAgfSk7XG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdleGl0JywgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVJlYWN0U2NyaXB0c0FwcChhcHBOYW1lOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8YW55PihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgY29uc3QgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzID0gc3Bhd24oXG4gICAgICAnbnB4JyxcbiAgICAgIFsnY3JlYXRlLXJlYWN0LWFwcCcsIGFwcE5hbWVdLFxuICAgICAgeyBzdGRpbzogJ2luaGVyaXQnIH1cbiAgICApO1xuXG4gICAgY3JlYXRlUmVhY3ROYXRpdmVQcm9jZXNzLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgICBjcmVhdGVSZWFjdE5hdGl2ZVByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbG9nU3BhY2VkKGFyZ3MpIHtcbiAgY29uc29sZS5sb2coJycpO1xuICBjb25zb2xlLmxvZyhMb2dDb2xvciwgYXJncyk7XG4gIGNvbnNvbGUubG9nKCcnKTtcbn1cblxuZnVuY3Rpb24gZXhjbHVkZU9iamVjdEtleXMob2JqZWN0OiBvYmplY3QsIGlnbm9yZWRLZXlzOiBzdHJpbmdbXSk6IG9iamVjdCB7XG4gIGxldCBuZXdPYmplY3QgPSB7IC4uLm9iamVjdCB9O1xuICBpZ25vcmVkS2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBkZWxldGUgbmV3T2JqZWN0W2tleV07XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqZWN0O1xufVxuXG5mdW5jdGlvbiByZXBsYWNlVmFsdWVzT2ZPYmplY3QoXG4gIG9iamVjdDogb2JqZWN0LFxuICBzZWFyY2g6IHN0cmluZyxcbiAgcmVwbGFjZTogc3RyaW5nXG4pOiBvYmplY3Qge1xuICBsZXQgbmV3T2JqZWN0ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coeyBrZXkgfSk7XG4gICAgY29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAvLyBjb25zb2xlLmxvZyh7IHZhbHVlIH0pO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgbmV3T2JqZWN0W2tleV0gPSB2YWx1ZS5yZXBsYWNlID8gdmFsdWUucmVwbGFjZShzZWFyY2gsIHJlcGxhY2UpIDogdmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG5ld09iamVjdDtcbn1cblxuZnVuY3Rpb24gcHJlZml4T2JqZWN0KG9iamVjdDogb2JqZWN0LCBwcmVmaXg6IHN0cmluZyk6IG9iamVjdCB7XG4gIGxldCBuZXdPYmplY3QgPSB7fTtcbiAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBuZXdPYmplY3RbcHJlZml4ICsga2V5XSA9IG9iamVjdFtrZXldO1xuICB9KTtcbiAgcmV0dXJuIG5ld09iamVjdDtcbn1cbiJdfQ==