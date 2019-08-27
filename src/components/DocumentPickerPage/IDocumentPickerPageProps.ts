import { FileTypes } from "../../types";

export interface IDocumentPickerPageProps {
  rootUrl: string;
  onSelect: (value: string) => void;
  extensions?: string[];
  fileType?: FileTypes;
  headerText?: string;
}
