import * as React from 'react';
import { IUploadState } from './IUploadState';
import { IUploadProps } from './IUploadProps';

class Upload extends React.Component<IUploadProps, IUploadState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return (
      <div >
        <h3>Upload Component!</h3>
      </div>
    );
  }
}

export default Upload;
