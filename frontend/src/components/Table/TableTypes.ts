export type TableColumn<T> = {
  key: T;
  label: string;
};

export type TableProps<
  T extends Record<string, unknown>,
  K = keyof T | string,
> = {
  cols: TableColumn<K>[];
  rows: T[];
  rowId: K;
};
