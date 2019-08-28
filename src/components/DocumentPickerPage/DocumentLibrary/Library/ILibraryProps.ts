import { IDocument } from "./Library";
import { SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { IFile } from "../DocumentLibrary";

export interface ILibraryProps {
  rootUrl: string;
  getDocuments: (serverRelativeUrl?: string) => Promise<IDocument[]>;
  getFolders: (serverRelativeUrl?: string) => Promise<IDocument[]>;
  isCompactMode?: boolean;
  selectionMode?: SelectionMode;
  uploadDocument?: (file: File, relativeUrl: string) => Promise<IDocument>;
  onSelect: (value: string) => void;
  includeFolders?: boolean;
  selectedValue?: string;
}
