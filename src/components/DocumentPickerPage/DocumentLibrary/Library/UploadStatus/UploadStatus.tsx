import * as React from 'react';
import { IUploadStatusState } from './IUploadStatusState';
import { IUploadStatusProps } from './IUploadStatusProps';

import { DefaultButton, ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import { FileUploadStatus } from '../Library';

const classNames = mergeStyleSets({
  container: {
    padding: 15,
  },
  fileItem: {
    borderBottom: "solid thin #fff",
  },
  fileName: {
    verticalAlign: "middle",
    padding: "5px 0",
    paddingRight: "10px",
    display: "inline-block",
  },
  statusIcon: {
    verticalAlign: "middle",
  }
});

class UploadStatus extends React.Component<IUploadStatusProps, IUploadStatusState> {
  private _menuButtonElement = React.createRef<HTMLDivElement>();
  constructor(props) {
    super(props);
    this.state = {
      isCalloutVisible: false,
      uploading: false,
      uploadCompleted: false,
      uploadFailed: false,
    };
  }

  public componentDidUpdate(prevProps: IUploadStatusProps) {
    if (this.props.fileUploadStatus !== prevProps.fileUploadStatus) {
      let uploading = false;
      let uploadCompleted = false;
      let uploadFailed = false;
      const completedStatuses: FileUploadStatus[] = [];
      const { fileUploadStatus } = this.props;
      for (const key in fileUploadStatus) {
        if (fileUploadStatus[key].status === FileUploadStatus.Uploading) {
          uploading = true;
        }
        completedStatuses.push(fileUploadStatus[key].status);
      }

      if (completedStatuses.every(status => status === FileUploadStatus.Completed)) {
        uploadCompleted = true;
      }

      if (completedStatuses.some(status => status === FileUploadStatus.Failed)) {
        uploadFailed = true;
      }
      this.setState({
        uploading,
        uploadCompleted,
        uploadFailed,
      });
    }
  }

  public render(): JSX.Element {
    const { uploading, uploadCompleted, uploadFailed } = this.state;
    if (!uploading && !uploadCompleted && !uploadFailed) {
      return null;
    }
    const keys = Object.keys(this.props.fileUploadStatus);

    return (
      <div>
        <div ref={this._menuButtonElement}>
          <ActionButton
            onClick={this._onShowMenuClicked}
          >
            {uploading && <Spinner />}
            {uploadCompleted && <Icon iconName="CheckMark" />}
            {uploadFailed && <Icon iconName="Error" />}
          </ActionButton>
        </div>
        <Callout
          className="ms-CalloutExample-callout"
          role="alertdialog"
          gapSpace={0}
          target={this._menuButtonElement.current}
          onDismiss={this._onCalloutDismiss}
          setInitialFocus={true}
          hidden={!this.state.isCalloutVisible}
        >
          <div className={classNames.container}>
            {keys.map(key => {
              const fileUploadStatus = this.props.fileUploadStatus[key];
              const iconName =
                (fileUploadStatus.status === FileUploadStatus.Completed && "StatusCircleCheckmark") ||
                (fileUploadStatus.status === FileUploadStatus.Pending && "") ||
                (fileUploadStatus.status === FileUploadStatus.Uploading && "StatusCircleRing") ||
                (fileUploadStatus.status === FileUploadStatus.Failed && "Error");

              return (
                <div className={classNames.fileItem}>
                  <span className={classNames.fileName}>
                    {this.props.fileUploadStatus[key].name}
                  </span>
                  <Icon iconName={iconName} className={classNames.statusIcon} />
                  {fileUploadStatus.status === FileUploadStatus.Failed && <MessageBar
                    messageBarType={MessageBarType.error}
                  >
                    {fileUploadStatus.errorMessage}
                  </MessageBar>}
                </div>
              );
            })}
          </div>
        </Callout>
      </div>
    );
  }


  private _onShowMenuClicked = (): void => {
    this.setState({
      isCalloutVisible: !this.state.isCalloutVisible
    });
  };

  private _onCalloutDismiss = (): void => {
    this.setState({
      isCalloutVisible: false
    });
  };
}

export default UploadStatus;
