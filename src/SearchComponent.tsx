import React, { useMemo } from 'react';
import { SearchableTable, TableBodyRow } from 'flipper';
import { Button, Typography } from 'antd';
import { DataList, Layout, Panel } from 'flipper-plugin';
import { Row } from './types';

const columns = {
  time: {
    value: 'Time',
  },
  store: {
    value: 'Store',
  },
  action: {
    value: 'Action',
  },
  took: {
    value: 'Took',
  },
};

const columnSizes = {
  time: '20%',
  store: '20%',
  action: '40%',
  took: '20%',
};

interface IProps {
  actions: Row[];
  onPress: (key: string[]) => void;
  onClear: () => void;
  onFilterSelect: (newSelection: string) => void;
  storeSelectionList: { title: string; id: string }[];
  selectedStore: string;
}

export const SearchComponent: React.FC<IProps> = ({
  actions,
  onPress,
  onClear,
  onFilterSelect,
  storeSelectionList,
  selectedStore,
}) => {
  const rows = useMemo(
    () =>
      actions.map(
        (row): TableBodyRow => ({
          columns: {
            time: {
              value: <Typography.Text>{row.time}</Typography.Text>,
            },
            store: {
              value: <Typography.Text>{row.storeName}</Typography.Text>,
            },
            action: {
              value: <Typography.Text>{row.action.type}</Typography.Text>,
            },
            took: {
              value: <Typography.Text>{row.took}</Typography.Text>,
            },
          },
          key: row.id,
          copyText: JSON.stringify(row),
          filterValue: `${row.id}`,
        }),
      ),
    [actions],
  );

  return (
    <Layout.Container grow>
      <Panel title='Filter'>
        <DataList
          items={storeSelectionList}
          onSelect={onFilterSelect}
          selection={selectedStore}
          style={{ minHeight: '200px' }}
        />
      </Panel>
      <SearchableTable
        key={100}
        rowLineHeight={28}
        floating={false}
        multiline
        columnSizes={columnSizes}
        columns={columns}
        onRowHighlighted={onPress}
        multiHighlight={false}
        rows={rows}
        stickyBottom
        actions={<Button onClick={onClear}>Clear</Button>}
      />
    </Layout.Container>
  );
};
