


This package will help you in creating a React-Native app which runs on the web with React Native Web while using the best tools of both worlds so you can have one codebase for Android, iOS and Web. Y

With react-native-web you can share more than 90% of your app between Android, iOS and web. But you'll need to create some abstractions for some packages.

Used library in background for web: https://github.com/facebook/create-react-app    
Used library for React-Native: React Native CLI    

## Getting started

Follow instructions on and click the 'React Native CLI Quickstart'
https://reactnative.dev/docs/environment-setup



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

