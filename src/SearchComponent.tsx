import React, { useState } from 'react';
import { Button, Select, Typography } from 'antd';
import { DataSource, DataTable, DataTableColumn, Dialog, Layout, Panel } from 'flipper-plugin';

import { Row } from './types';

const columns: DataTableColumn<Row>[] = [
  {
    key: 'time',
    title: 'Time',
    width: '20%',
  },
  {
    key: 'storeName',
    title: 'Store',
    width: '20%',
  },
  {
    key: 'actionName',
    title: 'Action',
    width: '40%',
    onRender: ({ action: { type } }) => <Typography.Text>{type}</Typography.Text>,
  },
  {
    key: 'took',
    title: 'Took',
    width: '20%',
  },
];

interface IProps {
  data: DataSource<Row, string>;
  onSelect: (row: Row | undefined) => void;
  onClear: () => void;
  onFilterSelect: (newSelection: string) => void;
  clearPersistedData: (() => void) | null;
  storeSelectionList: { title: string; id: string }[];
  selectedStore: string;
}

export const SearchComponent: React.FC<IProps> = ({
  data,
  onSelect,
  onClear,
  onFilterSelect,
  clearPersistedData,
  storeSelectionList,
  selectedStore,
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (): Promise<true> => {
    if (clearPersistedData) {
      setLoading(true);
      clearPersistedData();
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return true;
  };

  return (
    <Layout.Container grow>
      <Panel title='Filter' pad='small' collapsible={false}>
        <Select
          value={selectedStore}
          showSearch
          placeholder='Select a store'
          optionFilterProp='children'
          onChange={onFilterSelect}
          onSearch={onFilterSelect}
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }>
          {storeSelectionList.map(({ id, title }) => (
            <Select.Option value={id}>{title}</Select.Option>
          ))}
        </Select>
      </Panel>
      <DataTable
        dataSource={data}
        columns={columns}
        onSelect={onSelect}
        extraActions={
          <>
            <Button onClick={onClear}>Clear Logs</Button>
            {clearPersistedData ? (
              <Button
                loading={loading}
                onClick={() => {
                  Dialog.confirm({
                    title: 'Wipe persisted stores?',
                    message: <Typography>This will clear all persisted data related to stores.</Typography>,
                    onConfirm: handleClick,
                  });
                }}>
                Wipe Persisted Stores
              </Button>
            ) : null}
          </>
        }
      />
    </Layout.Container>
  );
};
