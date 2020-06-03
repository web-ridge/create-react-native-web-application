interface PackageType {
  name: string;
  version: string;
  isDev: boolean;
}
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

// run the app ;)
app();

async function app() {
  const appName = argv.name;
  const appNameWeb = appName + '-web';

  logSpaced(`Creating ${appName}`);

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
  const webPackageFile = fs.readFileSync(webPackagePath);
  const webPackageJSON = JSON.parse(webPackageFile);

  const webDependencies: PackageType[] = Object.keys(
    webPackageJSON.dependencies
  ).map((packageName) => ({
    name: packageName,
    version: webPackageJSON.dependencies[packageName],
    isDev: false,
  }));

  const reactNativePackagePath = appName + '/package.json';
  const reactNativePackageFile = fs.readFileSync(reactNativePackagePath);
  const reactNativePackageJSON = JSON.parse(reactNativePackageFile);

  const mergedPackageJSON = {
    ...reactNativePackageJSON,
    // we're gonna merge scripts and dependencies ourself :)
    ...excludeObjectKeys(webPackageJSON, ['dependencies', 'scripts']),
    scripts: {
      ...reactNativePackageJSON.scripts,
      ...replaceValuesOfObject(
        prefixObject(webPackageJSON, 'web:'),
        'react-app-scripts',
        'react-app-rewired'
      ),
    },
  };

  // write merged package.json down
  fs.writeFileSync(reactNativePackagePath, JSON.stringify(mergedPackageJSON));

  // install web packages to native project
  await installPackages(
    [
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
    ],
    appName
  );

  // copy template files

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
}

async function installPackages(
  packages: PackageType[],
  directory: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const createReactNativeProcess = spawn(
      'yarn',
      [
        '--cwd',
        directory,
        'add',
        packages
          .map((package) => `${package.name}@${package.version}`)
          .join(' '),
      ],
      { stdio: 'inherit' }
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
      { stdio: 'inherit' }
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
      { stdio: 'inherit' }
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
  console.log(FgGreen, args);
  console.log('');
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
