import { FileUploadStatus } from "../Library";

export interface IUploadStatusProps {
  fileUploadStatus: {
    [key: string]: {
      name: string;
      status: FileUploadStatus;
      errorMessage: string;
    }
  };
}
