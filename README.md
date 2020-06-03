This package will help you in creating a React-Native app which runs on the web with React Native Web (used in the Twitter webapp) while using the best tools of both worlds. You'll always be using the latest version of both libraries. This program only merges some configs to give you a fast start :)

This package will help you in creating a React-Native app which runs on the web with React Native Web while using the best tools of both worlds so you can have one codebase for Android, iOS and Web.

With react-native-web you can share more than 90% of your app between Android, iOS and web. But you'll need to create some abstractions for some packages.

Used library in background for web: https://create-react-app.dev/ (we enabled fast refresh for you!)  
Used library for React-Native: React Native CLI https://reactnative.dev/docs/environment-setup

## Getting started

You need to have React Native installed :) (Not Expo)  
Follow instructions on and click the 'React Native CLI Quickstart'  
https://reactnative.dev/docs/environment-setup

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

## How can I use really native packages but sometimes else on the web version

We can almost share a lot of things but we created some abstractions on top of e.g. React Native Navigation to have cross platform navigation while using react-router-dom on the web.

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
