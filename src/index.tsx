import React, { useState } from 'react';
import { PluginClient, usePlugin, createState, useValue, Layout, createDataSource, uuid } from 'flipper-plugin';
import { SearchComponent } from './SearchComponent';
import { SidebarComponent } from './SidebarComponent';
import { Events, Requests, Row, Settings } from './types';

// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Requests>) {
  const allData = createDataSource<Row, 'id'>([], { key: 'id' });
  const settings = createState<Settings>({
    isAsyncStoragePresent: false,
    storeList: [{ title: 'All Stores', id: '0' }],
  });

  client.onMessage('init', (newSettings) => {
    settings.update((draft) => {
      draft.isAsyncStoragePresent = newSettings.isAsyncStoragePresent;
      draft.storeList = [{ title: 'All Stores', id: '0' }].concat(
        newSettings.stores?.map((name) => ({ id: name, title: name })) ?? [],
      );
    });
    allData.view.setSortBy('startTime');
  });

  client.onMessage('action', (newData) => {
    const dataRow = { ...newData, id: uuid() };
    allData.upsert(dataRow);
  });

  const clear = () => {
    allData.view.reset();
    allData.view.setSortBy('startTime');
    allData.clear();
  };

  const clearPersistedState = async () => {
    client.send('clearStorage', undefined);
    clear();
  };

  const onStoreSelected = (newStore: string) => {
    if (newStore === '0') {
      allData.view.reset();
      allData.view.setSortBy('startTime');
      return;
    }
    allData.view.setFilter(({ storeName }) => storeName === newStore);
  };

  return {
    allData,
    settings,
    clearPersistedState,
    clear,
    onStoreSelected,
  };
}

// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const { allData, settings, clearPersistedState, clear, onStoreSelected } = usePlugin(plugin);
  const { isAsyncStoragePresent, storeList } = useValue(settings);
  const [selectedID, setSelectedID] = useState('');
  const [selectedStore, setSelectedStore] = useState('0');

  const onRowHighlighted = (row: Row | undefined) => {
    setSelectedID(row?.id ?? '');
  };

  const clearData = () => {
    clear();
    setSelectedID('');
  };

  const handleStoreSelect = (newStore: string) => {
    setSelectedStore(newStore);
    onStoreSelected(newStore);
  };

  return (
    <Layout.Container grow={true}>
      <SearchComponent
        data={allData}
        onSelect={onRowHighlighted}
        onClear={clearData}
        onFilterSelect={handleStoreSelect}
        clearPersistedData={isAsyncStoragePresent ? clearPersistedState : null}
        storeSelectionList={storeList}
        selectedStore={selectedStore}
      />
      <SidebarComponent selectedID={selectedID} actions={allData} />
    </Layout.Container>
  );
}
