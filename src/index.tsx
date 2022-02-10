import React from 'react';
import { FlipperPlugin, FlexColumn, Button, MultiLineInput, FlexRow, Input, ErrorBlock } from 'flipper';
import SidebarComponent from './components/SidebarComponent';
import SearchComponent from './components/SearchComponent';

type State = {
  selectedId: string;
  error: string | null;
};

export type Row = {
  id: string;
  action: {
    type: string;
    payload: any;
  };
  took: string;
  time: string;
  before: object;
  after: object;
  storeName: string;
};

type PersistedState = {
  actions: Row[];
};

export enum TabLabel {
  state = 'StateTree',
  diff = 'Diff',
}

export type DispatchAction = {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value: any;
};

const defaultSelection = { title: 'All', id: '0' };

export default class ReduxViewer extends FlipperPlugin<State, any, any> {
  state = {
    selectedId: '',
    selectedStore: '0',
    error: '',
  };

  static defaultPersistedState: PersistedState = {
    actions: [],
  };

  static persistedStateReducer(persistedState: PersistedState, method: string, payload: Row) {
    switch (method) {
      case 'init':
        return {
          ...persistedState,
          actions: [payload],
        };
      case 'action':
        return {
          ...persistedState,
          actions: [...persistedState.actions, payload],
        };
      default:
        return persistedState;
    }
  }

  onRowHighlighted = (key: string[]) => {
    this.setState({ selectedId: key[0] });
  };

  onStoreSelect = (storeName: string) => {
    if (storeName !== this.state.selectedStore) {
      this.setState({ selectedStore: storeName });
    }
  };

  clear = () => {
    this.setState({ selectedId: '', selectedStore: '0' });
    this.props.setPersistedState({ actions: [] });
  };

  render() {
    const { error, selectedId, selectedStore } = this.state;
    const actions: Row[] = this.props.persistedState.actions;

    const actionsToDisplay =
      selectedStore !== '0' ? actions.filter(({ storeName }) => storeName === this.state.selectedStore) : actions;

    const uniqueStores = Array.from(
      new Set(actions.map(({ storeName }) => storeName).filter((storeName) => storeName)),
    );

    const storeSelectionList = [defaultSelection].concat(uniqueStores.map((name) => ({ id: name, title: name })));

    return (
      <FlexColumn grow={true}>
        {error && <ErrorBlock error={error}></ErrorBlock>}
        <SearchComponent
          actions={actionsToDisplay}
          onPress={this.onRowHighlighted}
          onClear={this.clear}
          onFilterSelect={this.onStoreSelect}
          storeSelectionList={storeSelectionList}
          selectedStore={selectedStore}
        />
        <SidebarComponent selectedId={selectedId} actions={actions} />
      </FlexColumn>
    );
  }
}
