This package will help you in creating a React-Native app which runs on the web with React Native Web (used in the Twitter webapp: https://github.com/necolas/react-native-web) while using the best tools of both worlds. You'll always be using the latest version of both libraries. This program only merges some configs to give you a fast start :)

This package will help you in creating a React-Native app which runs on the web with React Native Web while using the best tools of both worlds so you can have one codebase for Android, iOS and Web.

With react-native-web you can share more than 90% of your app between Android, iOS and web. But you'll need to create some abstractions for some packages.

Used library in background for web: https://create-react-app.dev/ (we enabled fast refresh for you!)  
Used library for React-Native: React Native CLI https://reactnative.dev/docs/environment-setup

## Getting started

You need to have React Native installed :) (Not Expo)  
Follow instructions on and click the 'React Native CLI Quickstart'  
https://reactnative.dev/docs/environment-setup

And then you need to run this command (myapp can be something you desire)

```
npx create-react-native-web-application --name myappname
```

## Commands

### Native commands

```
yarn android
yarn ios
yarn start
yarn test
yarn lint
```

### Web commands

```
yarn web
yarn web:build
yarn web:test
yarn web:eject
```

## Tips

- Look up React Native Docs
- Look up https://github.com/necolas/react-native-web
- Look for web support in React Native packages
- Install the Prettier extension in Visual Code
- Enable Hermes in build.gradle since it will give you a ~ 30% faster app on Android

```
// build.gradle in your Android folder
project.ext.react = [
  enableHermes: false, // clean and rebuild if changing
]
```

to

```
// build.gradle in your Android folder
project.ext.react = [
  enableHermes: true, // clean and rebuild if changing
]
```

## Install React Native Web packages which support web

You can add extra packages in `config-overrides.js` in the babelInclude plugin so react native packages will be compiled with babel.

## Install React Native Web packages which do not support web

We can almost share a lot of things but when a package does support the web you will need to create an abstraction and convert an interface to another package which does the same thing but for React JS or create your own abstraction.

Create a file package-name.ts

```typescript
import NativeModule from 'react-native-module-without-web-support';
export default NativeModule;
```

Create a file package-name.web.ts

```typescript
import React from 'react';
export function someLibraryFunc() {
  return webimplementation;
}
export default function YourImplemenation() {}
```

## Updates or supported libraries

We will publish more open-source in the fute also a cross platform abstraction for React Native Navigation so consider following us on Github or Twitter :-)

https://twitter.com/web_ridge  
https://twitter.com/RichardLindhout
