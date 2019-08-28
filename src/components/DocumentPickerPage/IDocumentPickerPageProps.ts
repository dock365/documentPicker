import { FileTypes } from "../../types";

export interface IDocumentPickerPageProps {
  rootUrl: string;
  onSelect: (value: string) => void;
  value?: string;
  extensions?: string[];
  fileType?: FileTypes;
  headerText?: string;
  isOpen?: boolean;
  onDismiss?: () => void;
  includeFolders?: boolean;
  allowCustomUrl?: boolean;
}
