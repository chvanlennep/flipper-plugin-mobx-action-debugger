export type Events = {
  action: Row;
  init: Settings;
};

export type Requests = {
  clearStorage: () => Promise<any>;
};

export type Row = {
  id: string;
  actionName: string;
  action: {
    type: string;
    payload: any;
  };
  took: string;
  startTime: string;
  time: string;
  before: object;
  after: object;
  storeName: string;
  isAsyncStoragePresent?: boolean;
};

export type Settings = {
  isAsyncStoragePresent: boolean;
  storeList: { id: string; title: string }[];
  stores?: string[];
};

export enum TabLabel {
  state = 'StateTree',
  diff = 'Diff',
}
