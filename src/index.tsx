import React, { useState } from 'react';
import { PluginClient, usePlugin, createState, useValue, Layout } from 'flipper-plugin';
import { SearchComponent } from './SearchComponent';
import { SidebarComponent } from './SidebarComponent';
import { Events, Requests, Row } from './types';

const defaultSelection = { title: 'All', id: '0' };

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Requests>) {
  const data = createState<Row[]>([], { persist: 'data' });

  client.onMessage('action', (newData) => {
    data.update((draft) => {
      draft.push(newData);
      draft = draft.sort((a, b) => {
        if (a.startTime < b.startTime) {
          return -1;
        }
        if (a.startTime === b.startTime) {
          return 0;
        }
        return 1;
      });
    });
  });

  client.onMessage('init', (newData) => {
    data.update((draft) => {
      draft = [newData];
    });
  });

  const clear = () => {
    const firstItem = data.get()[0];
    data.set(firstItem.action?.type === 'INIT' ? [firstItem] : []);
  };

  const clearPersistedState = () => {
    client.send('clearStorage', undefined);
  };

  return {
    data,
    clear,
    clearPersistedState,
  };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const actions = useValue(instance.data);

  const [{ selectedId, selectedStore }, setState] = useState<{
    selectedId: string;
    selectedStore: string;
  }>({ selectedId: '', selectedStore: '0' });

  const onRowHighlighted = (key: string[]) => {
    setState((old) => ({ ...old, selectedId: key[0] }));
  };

  const onStoreSelect = (storeName: string) => {
    if (storeName !== selectedStore) {
      setState((old) => ({ ...old, selectedStore: storeName }));
    }
  };

  const clearData = () => {
    instance.clear();
    setState((old) => ({ selectedStore: '0', selectedId: '' }));
  };

  const actionsToDisplay =
    selectedStore === '0' ? actions : actions.filter(({ storeName }) => storeName === selectedStore);

  const uniqueStores = Array.from(new Set(actions.map(({ storeName }) => storeName).filter(Boolean)));

  const storeSelectionList = [defaultSelection].concat(uniqueStores.map((name) => ({ id: name, title: name })));

  const asyncStoragePresent = actions[0]?.isAsyncStoragePresent ?? false;

  return (
    <Layout.Container grow={true}>
      <SearchComponent
        actions={actionsToDisplay}
        onPress={onRowHighlighted}
        onClear={clearData}
        onFilterSelect={onStoreSelect}
        clearPersistedData={asyncStoragePresent ? instance.clearPersistedState : null}
        storeSelectionList={storeSelectionList}
        selectedStore={selectedStore}
      />
      <SidebarComponent selectedId={selectedId} actions={actions} />
    </Layout.Container>
  );
}
