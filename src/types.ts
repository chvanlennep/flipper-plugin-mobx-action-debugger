export type Events = {
  action: Row;
  init: Settings;
};

export type Requests = {
  clearStorage: () => Promise<any>;
};

export type Row = {
  id: string;
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
};

export enum TabLabel {
  state = 'StateTree',
  diff = 'Diff',
}
