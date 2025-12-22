export interface Option {
    label: string;
    value: number;
}

export interface OptionGroup {
    category: string;
    options: Option[];
}

export interface BoxSelection {
    boxId: number;
    optionLabel: string | null;
}