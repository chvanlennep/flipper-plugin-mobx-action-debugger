# Mobx Action Debugger Flipper Plugin

Flipper plugin for MobX action debugging in React Native.

## Installation

1. Install [mobx-action-flipper](https://github.com/chvanlennep/mobx-action-flipper) middleware and `react-native-flipper` in your React Native app:

```bash
yarn add mobx-action-flipper react-native-flipper
# for iOS
cd ios && pod install
```

2. Middleware configuration:

Note: this function should be called only once at app startup. Further calls will have no effect.

```javascript
import { debugMobxActions } from 'mobx-action-flipper';

// MobX stores:
const firstStore = new FirstStore();
const secondStore = new SecondStore();

// Any number of stores can be passed in as an object:
debugMobxActions({ firstStore, secondStore });
```

If your MobX stores are persisted via AsyncStorage, pass AsyncStorage as the second argument to be able to wipe persisted MobX data from Flipper:

```javascript
import { debugMobxActions } from 'mobx-action-flipper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// MobX stores:
const firstStore = new FirstStore();
const secondStore = new SecondStore();

debugMobxActions({ firstStore, secondStore }, AsyncStorage);
```

3. Install [flipper-plugin-mobx-action-debugger](https://github.com/chvanlennep/flipper-plugin-mobx-action-debugger) in Flipper desktop client:

```
Manage Plugins > Install Plugins > search "mobx-action-debugger" > Install
```

4. Start your app and you should be able to see the debugger in Flipper.

## Acknowledgement

This plugin was forked from [flipper-plugin-mobx-debugger](https://github.com/khorark/flipper-plugin-mobx-debugger).
