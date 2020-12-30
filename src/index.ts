#!/usr/bin/env node
'use strict';
interface PackageType {
  name: string;
  version?: string;
  isDev?: boolean;
}
const LogColor = '\x1b[32m';

import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import yargs from 'yargs';

const argv = yargs
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
  } catch (error) {
    console.log('Could not create React Native project', { error });
  }

  logSpaced(
    "Created two projects in two directories. Let's merge them to one project ;)"
  );

  const webPackagePath = appNameWeb + '/package.json';
  const webPackageFile = fs.readFileSync(webPackagePath, 'utf8');
  const webPackageJSON = JSON.parse(webPackageFile);

  const removePackages = ['web-vitals'];

  const webDependencies: PackageType[] = Object.keys(
    webPackageJSON.dependencies
  )
    .filter((packageName) => !removePackages.includes(packageName))
    .map((packageName) => ({
      name: packageName,
      version: webPackageJSON.dependencies[packageName],
      isDev: packageName.includes('@testing-library'),
    }));

  const reactNativePackagePath = appName + '/package.json';
  const reactNativePackageFile = fs.readFileSync(
    reactNativePackagePath,
    'utf8'
  );
  const reactNativePackageJSON = JSON.parse(reactNativePackageFile);

  let webScripts = replaceValuesOfObject(
    prefixObject(webPackageJSON.scripts, 'web:'),
    'react-scripts',
    'react-app-rewired'
  );

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
  fs.writeFileSync(reactNativePackagePath, JSON.stringify(mergedPackageJSON));

  // install web packages to native project
  await installPackages(
    [
      ...webDependencies,
      { name: 'react-native-web' },
      { name: 'react-app-rewired', isDev: true },
      { name: 'customize-cra', isDev: true },
      { name: 'typescript', isDev: true },
      { name: '@types/react-native', isDev: true },
      { name: '@types/react', isDev: true },
      { name: 'babel-plugin-import', isDev: true },
    ],
    appName
  );

  // copy template files

  const templateDir = path.dirname(require.main.filename) + '/template';
  logSpaced({ templateDir });
  fs.copySync(templateDir, appName);

  fs.copySync(appNameWeb + '/public', appName + '/public');
  fs.unlinkSync(appName + '/App.js');

  fs.removeSync(appNameWeb);

  logSpaced("Yeah!! We're done!");
  logSpaced(`
  Start your app with by going to the created directory: 'cd ${appName}'

    yarn android
    npx pod-install && yarn ios
    yarn web
    
    If you have an import error on App.tsx restart your app, it's a cache issue.
    If you have red errors in VSCode read the README.md about this issue.
  `);
}

async function installPackages(packages: PackageType[], directory: string) {
  await installPackagesAdvanced(
    packages.filter((p) => p.isDev === true),
    directory,
    true
  );
  await installPackagesAdvanced(
    packages.filter((p) => !p.isDev),
    directory,
    false
  );
}
async function installPackagesAdvanced(
  packages: PackageType[],
  directory: string,
  dev: boolean
): Promise<any> {
  return new Promise((resolve, reject) => {
    const joinedPackages = packages.map(
      (p) => p.name + (p.version ? `@${p.version}` : ``)
    );
    // console.log({ joinedPackages });
    const createReactNativeProcess = spawn(
      'yarn',
      [
        '--cwd',
        directory,
        'add',
        ...joinedPackages,
        dev ? '--dev' : undefined,
      ].filter((n) => !!n),
      { stdio: 'inherit', shell: true }
    );

    createReactNativeProcess.on('error', function (error) {
      reject(error);
    });
    createReactNativeProcess.on('exit', function (response) {
      resolve(response);
    });
  });
}

async function createReactNativeApp(appName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const createReactNativeProcess = spawn(
      'npx',
      ['react-native', 'init', appName],
      { stdio: 'inherit', shell: true }
    );

    createReactNativeProcess.on('error', function (error) {
      reject(error);
    });
    createReactNativeProcess.on('exit', function (response) {
      resolve(response);
    });
  });
}

async function createReactScriptsApp(appName: string): Promise<any> {
  return new Promise<any>(function (resolve, reject) {
    const createReactNativeProcess = spawn(
      'npx',
      ['create-react-app', appName],
      { stdio: 'inherit', shell: true }
    );

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

function removeSuffix(str: string, suffix: string) {
  return str.substring(0, str.indexOf(suffix));
}

function excludeObjectKeys(object: object, ignoredKeys: string[]): object {
  let newObject = { ...object };
  ignoredKeys.forEach(function (key) {
    delete newObject[key];
  });
  return newObject;
}

function replaceValuesOfObject(
  object: object,
  search: string,
  replace: string
): object {
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

function prefixObject(object: object, prefix: string): object {
  let newObject = {};
  Object.keys(object).forEach((key) => {
    newObject[prefix + key] = object[key];
  });
  return newObject;
}
