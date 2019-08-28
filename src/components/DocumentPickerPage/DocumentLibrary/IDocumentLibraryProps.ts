import { Pages, FileTypes } from "../../../types";

export interface IDocumentLibraryProps {
  onSelect: (value: string) => void;
  page: Pages;
  rootUrl: string;
  extensions?: string[];
  fileType?: FileTypes;
  includeFolders?: boolean;
  selectedValue?: string;
}
