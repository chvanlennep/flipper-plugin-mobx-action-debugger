import React, { useEffect, useRef, useState } from 'react';
import { PluginClient, usePlugin, createState, useValue, Layout, createDataSource, uuid } from 'flipper-plugin';
import { SearchComponent } from './SearchComponent';
import { SidebarComponent } from './SidebarComponent';
import { Events, Requests, Row, Settings } from './types';

// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Requests>) {
  const allData = createDataSource<Row, 'id'>([], { key: 'id' });
  const filteredData = createDataSource<Row, 'id'>([], { key: 'id' });
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
  });

  client.onMessage('action', (newData) => {
    allData.upsert({ ...newData, id: uuid() });
  });

  const clearPersistedState = async () => {
    client.send('clearStorage', undefined);
  };

  return {
    filteredData,
    allData,
    settings,
    clearPersistedState,
  };
}

// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const { filteredData, allData, settings, clearPersistedState } = usePlugin(plugin);
  const { isAsyncStoragePresent, storeList } = useValue(settings);
  const [selectedID, setSelectedID] = useState('');
  const [selectedStore, setSelectedStore] = useState('0');

  const oldSelection = useRef('0');

  const onRowHighlighted = (row: Row | undefined) => {
    setSelectedID(row?.id ?? '');
  };

  const clearData = () => {
    filteredData.clear();
    allData.clear();
    setSelectedStore('0');
    setSelectedID('');
  };

  useEffect(() => {
    if (selectedStore !== '0' && selectedStore !== oldSelection.current) {
      filteredData.clear();
      allData.records().forEach((row) => {
        if (row.storeName === selectedStore) {
          filteredData.upsert(row);
        }
      });
    }
    oldSelection.current = selectedStore;
  }, [selectedStore]);

  return (
    <Layout.Container grow={true}>
      <SearchComponent
        data={selectedStore === '0' ? allData : filteredData}
        onSelect={onRowHighlighted}
        onClear={clearData}
        onFilterSelect={setSelectedStore}
        clearPersistedData={isAsyncStoragePresent ? clearPersistedState : null}
        storeSelectionList={storeList}
        selectedStore={selectedStore}
      />
      <SidebarComponent selectedID={selectedID} actions={allData} />
    </Layout.Container>
  );
}
