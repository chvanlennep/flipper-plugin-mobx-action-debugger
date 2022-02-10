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

export enum TabLabel {
  state = "StateTree",
  diff = "Diff",
}
