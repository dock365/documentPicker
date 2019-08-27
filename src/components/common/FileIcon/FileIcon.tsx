import * as React from 'react';
import { IFileIconProps } from './IFileIconProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { MS_BRAND_FILE_EXTENSIONS, IMAGE_EXTENSIONS, extensions, FileTypes } from '../../../types';


function getIconUrl(docType: string): string {
  return `https://static2.sharepointonline.com/files/fabric/assets/brand-icons/document/svg/${docType}_16x1.svg`;
}

const FileIcon: React.SFC<IFileIconProps> = (props) => {
  const fileType = props.fileType;
  if (!fileType) {
    return <Icon iconName="Document" title={fileType} style={{ "fontSize": "16px" }} />;
  }
  if (MS_BRAND_FILE_EXTENSIONS.some(type => fileType === type)) {
    return <img src={getIconUrl(fileType)} alt={fileType} title={fileType} />;
  }
  if (extensions[FileTypes.images].some(type => fileType === type)) {
    return <Icon iconName="FileImage" title={fileType} style={{ "fontSize": "16px" }} />;
  }
  if (extensions[FileTypes.videos].some(type => fileType === type)) {
    return <Icon iconName="Media" title={fileType} style={{ "fontSize": "16px" }} />;
  }
  if (fileType === "pdf") {
    return <Icon iconName="PDF" title={fileType} style={{ "fontSize": "16px" }} />;
  }
  if (fileType === "folder") {
    return <Icon iconName="Folder" title={fileType} style={{ "fontSize": "16px" }} />;
  }

  return <Icon iconName="Document" style={{ "fontSize": "16px" }} />;
};

export default FileIcon;
