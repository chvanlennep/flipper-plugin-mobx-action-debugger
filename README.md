# Mobx Debugger Plugin for Flipper

This project was forked from: https://github.com/khorark/flipper-plugin-mobx-debugger

Note: readme is not yet up to date- these instructions will not work at present without new react native plugin.

`flipper-plugin-mobx-action-debugger` allows you read React Native mobx logs inside [Flipper](https://fbflipper.com/):

- Action
- State comparison

## Get Started

1. Install [mobx-flipper](https://github.com/khorark/mobx-flipper) middleware and `react-native-flipper` in your React Native app:

```bash
yarn add mobx-flipper react-native-flipper
# for iOS
cd ios && pod install
```

2. Add the middleware:

- MobX

```javascript
import { spy } from 'mobx';
import { createMobxDebugger } from 'flipper-mobx';

const store = new Store(); // your store

if (__DEV__) {
  spy(createMobxDebugger(store));
}
```

- MobX-state-tree

```javascript
import { addMiddleware } from 'mobx-state-tree';
import { createMstDebugger } from 'flipper-mobx';

const store = new Store(); // your store

if (__DEV__) {
  addMiddleware(store, createMstDebugger(store));
}
```

3. Install [flipper-plugin-mobx-debugger](https://github.com/khorark/flipper-plugin-mobx-debugger) in Flipper desktop client:

```
Manage Plugins > Install Plugins > search "mobx-debugger" > Install
```

4. Start your app, then you should be able to see Mobx Debugger on your Flipper app

## Acknowledgement

This plugin was forked from [flipper-plugin-mobx-debugger](https://github.com/khorark/flipper-plugin-mobx-debugger).
