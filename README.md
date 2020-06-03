<<<<<<< HEAD
This package will help you in creating a React-Native app which runs on the web with React Native Web while using the best tools of both worlds. You'll always be using the latest version of both libraries. This program only merges some configs to give you a fast start :)
=======
>>>>>>> 46916644e1538114110d2d94dc244377896e9cfb



This package will help you in creating a React-Native app which runs on the web with React Native Web while using the best tools of both worlds so you can have one codebase for Android, iOS and Web. Y

With react-native-web you can share more than 90% of your app between Android, iOS and web. But you'll need to create some abstractions for some packages.

Used library in background for web: https://github.com/facebook/create-react-app    
Used library for React-Native: React Native CLI    

## Getting started

Follow instructions on and click the 'React Native CLI Quickstart'
https://reactnative.dev/docs/environment-setup

<<<<<<< HEAD
## Commands

### Native commands

````
yarn android
yarn ios
yarn start
yarn test
yarn lint
```

### Web commands

````

yarn web
yarn web:build
yarn web:test
yarn web:eject

```

## Tips
- Look up React Native Docs
- Install the Prettier extension in Visual Code
- Enable Hermes in android/build.gradle
```
=======


## Tips
- Install the Prettier extension in Visual Code
- Enable hermes in build.gradle since it will give you a ~ 30% faster app on Android
```
project.ext.react = [
    enableHermes: false,  // clean and rebuild if changing
]
```
to 
```
project.ext.react = [
    enableHermes: true,  // clean and rebuild if changing
]
```

## How can I use really native packages but sometimes else on the web version
We can almost share a lot of things but we created some abstractions on top of e.g. React Native Navigation to have cross platform navigation while using react-router-dom on the web.

Create a file package-name.ts
```typescript
import NativeModule from 'react-native-module-without-web-support'
export default NativeModule
```
Create a file package-name.web.ts 
```typescript
import React from 'react'
export function someLibraryFunc() {
    return webimplementation
}
export default function Yourimplemenation() {
  
}
```

>>>>>>> 46916644e1538114110d2d94dc244377896e9cfb
