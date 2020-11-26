#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LogColor = '\x1b[32m';
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const argv = yargs_1.default
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
// run the app ;)
app();
async function app() {
    const appName = argv.name;
    const appNameWeb = appName + '-web-will-be-deleted-afterwards';
    logSpaced(`
  Creating ${appName}, brought to you by webRidge.

  Please wait till everything is finished :)
  
  `);
    try {
        await Promise.all([
            createReactNativeApp(appName),
            createReactScriptsApp(appNameWeb),
        ]);
    }
    catch (error) {
        console.log('Could not create React Native project', { error });
    }
    logSpaced("Created two projects in two directories. Let's merge them to one project ;)");
    const webPackagePath = appNameWeb + '/package.json';
    const webPackageFile = fs_extra_1.default.readFileSync(webPackagePath, 'utf8');
    const webPackageJSON = JSON.parse(webPackageFile);
    const removePackages = ['web-vitals'];
    const webDependencies = Object.keys(webPackageJSON.dependencies)
        .filter((packageName) => !removePackages.includes(packageName))
        .map((packageName) => ({
        name: packageName,
        version: webPackageJSON.dependencies[packageName],
        isDev: packageName.includes('@testing-library'),
    }));
    const reactNativePackagePath = appName + '/package.json';
    const reactNativePackageFile = fs_extra_1.default.readFileSync(reactNativePackagePath, 'utf8');
    const reactNativePackageJSON = JSON.parse(reactNativePackageFile);
    let webScripts = replaceValuesOfObject(prefixObject(webPackageJSON.scripts, 'web:'), 'react-scripts', 'react-app-rewired');
    // more like yarn android, yarn ios, yarn web
    //@ts-ignore
    let webStartCommand = webScripts['web:start'];
    delete webScripts['web:start'];
    //@ts-ignore
    webScripts.web = webStartCommand;
    // console.log({ webScripts });
    const mergedPackageJSON = {
        ...reactNativePackageJSON,
        // we're gonna merge scripts and dependencies ourself :)
        ...excludeObjectKeys(webPackageJSON, ['dependencies', 'scripts', 'name']),
        scripts: {
            ...reactNativePackageJSON.scripts,
            ...webScripts,
        },
    };
    // write merged package.json down
    fs_extra_1.default.writeFileSync(reactNativePackagePath, JSON.stringify(mergedPackageJSON));
    // install web packages to native project
    await installPackages([
        ...webDependencies,
        { name: 'react-native-web' },
        { name: 'react-app-rewired', isDev: true },
        { name: 'customize-cra', isDev: true },
        { name: 'typescript', isDev: true },
        { name: '@types/react-native', isDev: true },
        { name: '@types/react', isDev: true },
        { name: 'babel-plugin-import', isDev: true },
    ], appName);
    // copy template files
    const templateDir = path_1.default.dirname(require.main.filename) + '/template';
    logSpaced({ templateDir });
    fs_extra_1.default.copySync(templateDir, appName);
    fs_extra_1.default.copySync(appNameWeb + '/public', appName + '/public');
    fs_extra_1.default.unlinkSync(appName + '/App.js');
    fs_extra_1.default.removeSync(appNameWeb);
    logSpaced("Yeah!! We're done!");
    logSpaced(`
  Start your app with by going to the created directory: 'cd ${appName}'

    yarn android
    yarn ios
    yarn web
  `);
}
async function installPackages(packages, directory) {
    await installPackagesAdvanced(packages.filter((p) => p.isDev === true), directory, true);
    await installPackagesAdvanced(packages.filter((p) => !p.isDev), directory, false);
}
async function installPackagesAdvanced(packages, directory, dev) {
    return new Promise((resolve, reject) => {
        const joinedPackages = packages.map((p) => p.name + (p.version ? `@${p.version}` : ``));
        // console.log({ joinedPackages });
        const createReactNativeProcess = child_process_1.spawn('yarn', [
            '--cwd',
            directory,
            'add',
            ...joinedPackages,
            dev ? '--dev' : undefined,
        ].filter((n) => !!n), { stdio: 'inherit' });
        createReactNativeProcess.on('error', function (error) {
            reject(error);
        });
        createReactNativeProcess.on('exit', function (response) {
            resolve(response);
        });
    });
}
async function createReactNativeApp(appName) {
    return new Promise((resolve, reject) => {
        const createReactNativeProcess = child_process_1.spawn('npx', ['react-native', 'init', appName], { stdio: 'inherit' });
        createReactNativeProcess.on('error', function (error) {
            reject(error);
        });
        createReactNativeProcess.on('exit', function (response) {
            resolve(response);
        });
    });
}
async function createReactScriptsApp(appName) {
    return new Promise(function (resolve, reject) {
        const createReactNativeProcess = child_process_1.spawn('npx', ['create-react-app', appName], { stdio: 'inherit' });
        createReactNativeProcess.on('error', function (error) {
            reject(error);
        });
        createReactNativeProcess.on('exit', function (response) {
            resolve(response);
        });
    });
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
    let newObject = { ...object };
    ignoredKeys.forEach(function (key) {
        delete newObject[key];
    });
    return newObject;
}
function replaceValuesOfObject(object, search, replace) {
    let newObject = {};
    Object.keys(object).forEach((key) => {
        // console.log({ key });
        const value = object[key];
        // console.log({ value });
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
