import React, { useState } from "react";
import {
  PluginClient,
  usePlugin,
  createState,
  useValue,
  Layout,
} from "flipper-plugin";
import { ErrorBlock } from "flipper";
import { SearchComponent } from "./SearchComponent";
import { SidebarComponent } from "./SidebarComponent";
import { Row } from "./types";

type Events = {
  action: Row;
  init: Row;
};

const defaultSelection = { title: "All", id: "0" };

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, {}>) {
  const data = createState<Row[]>([], { persist: "data" });

  client.onMessage("action", (newData) => {
    data.update((draft) => {
      draft.push(newData);
    });
  });

  client.onMessage("init", (newData) => {
    data.update(() => {
      data.set([newData]);
    });
  });

  const clear = () => {
    data.set([]);
  };

  return { data, clear };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const actions = useValue(instance.data);

  const [{ selectedId, selectedStore, error }, setState] = useState<{
    selectedId: string;
    selectedStore: string;
    error: string;
  }>({ selectedId: "", selectedStore: "0", error: "" });

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
    setState({ selectedId: "", selectedStore: "0", error: "" });
  };

  const actionsToDisplay =
    selectedStore !== "0"
      ? actions.filter(({ storeName }) => storeName === selectedStore)
      : actions;

  const uniqueStores = Array.from(
    new Set(
      actions
        .map(({ storeName }) => storeName)
        .filter((storeName) => storeName),
    ),
  );

  const storeSelectionList = [defaultSelection].concat(
    uniqueStores.map((name) => ({ id: name, title: name })),
  );

  return (
    <Layout.Container grow={true}>
      {error && <ErrorBlock error={error}></ErrorBlock>}
      <SearchComponent
        actions={actionsToDisplay}
        onPress={onRowHighlighted}
        onClear={clearData}
        onFilterSelect={onStoreSelect}
        storeSelectionList={storeSelectionList}
        selectedStore={selectedStore}
      />
      <SidebarComponent selectedId={selectedId} actions={actions} />
    </Layout.Container>
  );
}
