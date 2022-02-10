# Mobx Action Debugger Flipper Plugin

Flipper plugin for MobX action debugging in React Native.

## Get Started

1. Install [mobx-action-flipper](https://github.com/chvanlennep/mobx-action-flipper) middleware and `react-native-flipper` in your React Native app:

```bash
yarn add mobx-action-flipper react-native-flipper
# for iOS
cd ios && pod install
```

2. Add the middleware:

- MobX

```javascript
import { debugMobxActions } from 'mobx-action-flipper';

const firstStore = new FirstStore(); // Mobx store
const secondStore = new SecondStore(); // Any number of stores can be passed into function

debugMobxActions({ firstStore, secondStore });
```

3. Install [flipper-plugin-mobx-action-debugger](https://github.com/chvanlennep/flipper-plugin-mobx-action-debugger) in Flipper desktop client:

```
Manage Plugins > Install Plugins > search "mobx-action-debugger" > Install
```

4. Start your app and you should be able to see the debugger in Flipper.

## Acknowledgement

This plugin was forked from [flipper-plugin-mobx-debugger](https://github.com/khorark/flipper-plugin-mobx-debugger).
