var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const FgGreen = '\x1b[32m';
const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const argv = require('yargs')
    .help()
    .option('name', {
    alias: 'n',
    description: 'Name of the app',
    type: 'string',
})
    .alias('help', 'h').argv;
if (!argv.name) {
    console.log('You should specify the name of the app with --name');
    process.exit();
}
app();
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        const appName = argv.name;
        const appNameWeb = appName + '-web';
        logSpaced(`Creating ${appName}`);
        try {
            yield Promise.all([
                createReactNativeApp(appName),
                createReactScriptsApp(appNameWeb),
            ]);
        }
        catch (error) {
            console.log('Could not create React Native project', { error });
        }
        logSpaced("Created two projects in two directories. Let's merge them to one project ;)");
        const webPackagePath = appNameWeb + '/package.json';
        const webPackageFile = fs.readFileSync(webPackagePath);
        const webPackageJSON = JSON.parse(webPackageFile);
        const webDependencies = Object.keys(webPackageJSON.dependencies).map((packageName) => ({
            name: packageName,
            version: webPackageJSON.dependencies[packageName],
            isDev: false,
        }));
        const reactNativePackagePath = appName + '/package.json';
        const reactNativePackageFile = fs.readFileSync(reactNativePackagePath);
        const reactNativePackageJSON = JSON.parse(reactNativePackageFile);
        const mergedPackageJSON = Object.assign(Object.assign(Object.assign({}, reactNativePackageJSON), excludeObjectKeys(webPackageJSON, ['dependencies', 'scripts'])), { scripts: Object.assign(Object.assign({}, reactNativePackageJSON.scripts), replaceValuesOfObject(prefixObject(webPackageJSON, 'web:'), 'react-app-scripts', 'react-app-rewired')) });
        fs.writeFileSync(reactNativePackagePath, JSON.stringify(mergedPackageJSON));
        yield installPackages([
            ...webDependencies,
            {
                name: 'react-native-web',
                version: 'latest',
                isDev: false,
            },
            {
                name: 'react-app-rewired',
                version: 'latest',
                isDev: true,
            },
            {
                name: 'customize-cra',
                version: 'latest',
                isDev: true,
            },
            {
                name: 'customize-cra-react-refresh',
                version: 'latest',
                isDev: true,
            },
            {
                name: '@types/react',
                version: 'latest',
                isDev: true,
            },
            { name: '@types/react-native', version: 'latest', isDev: true },
        ], appName);
        const templateDir = path.dirname(require.main.filename) + '/template';
        console.log({ templateDir });
        fs.copySync(templateDir, appName);
        fs.unlinkSync(appName + '/App.js');
        logSpaced("Yeah!! We're done!");
        logSpaced(`
  Start your app with
  
        yarn android
        yarn ios
        yarn web
  `);
    });
}
function installPackages(packages, directory) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const createReactNativeProcess = spawn('yarn', [
                '--cwd',
                directory,
                'add',
                packages
                    .map((package) => `${package.name}@${package.version}`)
                    .join(' '),
            ], { stdio: 'inherit' });
            createReactNativeProcess.on('error', function (error) {
                reject(error);
            });
            createReactNativeProcess.on('exit', function (response) {
                resolve(response);
            });
        });
    });
}
function createReactNativeApp(appName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const createReactNativeProcess = spawn('npx', ['react-native', 'init', appName], { stdio: 'inherit' });
            createReactNativeProcess.on('error', function (error) {
                reject(error);
            });
            createReactNativeProcess.on('exit', function (response) {
                resolve(response);
            });
        });
    });
}
function createReactScriptsApp(appName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const createReactNativeProcess = spawn('npx', ['create-react-app', appName], { stdio: 'inherit' });
            createReactNativeProcess.on('error', function (error) {
                reject(error);
            });
            createReactNativeProcess.on('exit', function (response) {
                resolve(response);
            });
        });
    });
}
function logSpaced(args) {
    console.log('');
    console.log(FgGreen, args);
    console.log('');
}
function excludeObjectKeys(object, ignoredKeys) {
    let newObject = Object.assign({}, object);
    ignoredKeys.forEach(function (key) {
        delete newObject[key];
    });
    return newObject;
}
function replaceValuesOfObject(object, search, replace) {
    let newObject = {};
    Object.keys(object).forEach((key) => {
        const value = object[key];
        if (value) {
            newObject[key] = value.replace ? value.replace(search, replace) : value;
        }
    });
    return newObject;
}
function prefixObject(object, prefix) {
    let newObject = {};
    Object.keys(object).forEach((key) => {
        newObject[prefix + key] = object[key];
    });
    return newObject;
}
