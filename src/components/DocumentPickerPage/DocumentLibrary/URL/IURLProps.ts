import { FileTypes } from "../../../../types";

export interface IURLProps {
  extensions?: string[];
  fileType?: FileTypes;
  onSelect: (value: string) => void;
  selectedValue?: string;
}
