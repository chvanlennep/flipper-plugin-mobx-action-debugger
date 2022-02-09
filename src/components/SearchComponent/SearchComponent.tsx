import React, { memo, useMemo } from 'react';
import { SearchableTable, Button, Text, TableBodyRow, FlexColumn, Panel } from 'flipper';
import { DataList } from 'flipper-plugin';
import { Row } from '../..';

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
  action: '35%',
  took: '15%',
};

interface IProps {
  actions: Row[];
  onPress: (key: string[]) => void;
  onClear: () => void;
  onFilterSelect: (newSelection: string) => void;
  storeSelectionList: { title: string; id: string }[];
  selectedStore: string;
}

const SearchComponent: React.FC<IProps> = ({
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
              value: <Text>{row.time}</Text>,
            },
            store: {
              value: <Text>{row.storeName}</Text>,
            },
            action: {
              value: <Text>{row.action.type}</Text>,
            },
            took: {
              value: <Text>{row.took}</Text>,
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
    <FlexColumn grow={true}>
      <Panel floating={false} heading='Filter'>
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
        multiline={true}
        columnSizes={columnSizes}
        columns={columns}
        onRowHighlighted={onPress}
        multiHighlight={false}
        rows={rows}
        stickyBottom={true}
        actions={<Button onClick={onClear}>Clear</Button>}
      />
    </FlexColumn>
  );
};

export default memo(SearchComponent);
