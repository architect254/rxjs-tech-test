export interface Option {
  id: string;
  label: string;
  operation: string;
}

export interface BoxSelection {
  boxId: number;
  optionId: string | null;
}
