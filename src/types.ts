export type Events = {
  action: Row;
  init: Row;
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
};

export enum TabLabel {
  state = 'StateTree',
  diff = 'Diff',
}
