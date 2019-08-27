import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { IDocument, FileUploadStatus } from "./Library";

export interface ILibraryState {
  columns: IColumn[];
  items: IDocument[];
  allItems: IDocument[];
  allFolders: IDocument[];
  isModalSelection: boolean;
  isCompactMode: boolean;
  loading: boolean;
  searchValue: string;
  currentServerRelativeUrl: string;
  rootDir: boolean;
  fileUploadStatus: {[key: string]: {
    name: string;
    status: FileUploadStatus;
    errorMessage: string;
  }};
}
