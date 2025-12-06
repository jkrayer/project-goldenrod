export type TableColumn<T, K extends keyof T | string = keyof T> = {
  key: K;
  label: string;
};

export type TableProps<T, K extends keyof T> = {
  cols: TableColumn<T>[];
  rows: T[];
  rowId: K;
};
