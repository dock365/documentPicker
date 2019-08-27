import * as React from 'react';
import { ILibraryState } from './ILibraryState';
import { ILibraryProps } from './ILibraryProps';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { SearchBox, SearchBoxBase, ISearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import FileIcon from '../../../common/FileIcon/FileIcon';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Breadcrumb, IBreadcrumbItem, IDividerAsProps } from 'office-ui-fabric-react/lib/Breadcrumb';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import UploadStatus from './UploadStatus/UploadStatus';

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px'
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden'
      }
    }
  },
  fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px'
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  exampleToggle: {
    display: 'inline-block',
    marginBottom: '10px',
    marginRight: '30px'
  },
  selectionDetails: {
    marginBottom: '20px'
  },
  searchBoxContainer: {
    margin: "15px 0"
  },
  uploadField: {
    display: "none",
  },
  baseActions: {
    display: 'flex',
    justifyContent: "space-between",
  },
  breadcrumb: {
    display: "flex",
    width: "100%",
    margin: "auto 0",
  },
  uploadButton: {
    display: "flex",
    justifyContent: "space-between",
    width: "68px",
    margin: "auto",
    padding: "5px 10px",
    cursor: "pointer",
  },
  actions: {
    position: "sticky",
    top: 0,
    paddingTop: "1px",
    zIndex: 1,
    background: "#fff",
  }
});

export interface IDocument {
  key: string;
  name: string;
  value: string;
  iconName?: string;
  fileType?: "folder" | string;
  modifiedBy?: string;
  dateModified?: string;
  dateModifiedValue?: number;
  fileSize?: string;
  fileSizeRaw?: number;
  serverRelativeUrl?: string;
}

export enum FileUploadStatus {
  Pending,
  Uploading,
  Completed,
  Failed,
}


class Library extends React.Component<ILibraryProps, ILibraryState> {
  private _selection: Selection;
  private searchBoxRef: React.RefObject<any>;

  constructor(props: ILibraryProps) {
    super(props);
    this._onColumnClick = this._onColumnClick.bind(this);
    this._onChangeCompactMode = this._onChangeCompactMode.bind(this);
    this._onChangeModalSelection = this._onChangeModalSelection.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this._onUpload = this._onUpload.bind(this);
    this._onItemInvoked = this._onItemInvoked.bind(this);
    this._onBackClick = this._onBackClick.bind(this);

    const columns: IColumn[] = [
      {
        key: 'fileType',
        name: 'File Type',
        className: classNames.fileIconCell,
        iconClassName: classNames.fileIconHeaderIcon,
        ariaLabel: 'Column operations for File type, Press to sort on File type',
        iconName: 'Page',
        isIconOnly: true,
        fieldName: 'name',
        minWidth: 16,
        maxWidth: 16,
        onColumnClick: this._onColumnClick,
        onRender: (item: IDocument) => <FileIcon fileType={item.fileType} />
      },
      {
        key: 'name',
        name: 'Name',
        fieldName: 'name',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      },
      {
        key: 'dateModified',
        name: 'Date Modified',
        fieldName: 'dateModifiedValue',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        onColumnClick: this._onColumnClick,
        data: 'number',
        onRender: (item: IDocument) => {
          return <span>{item.dateModified}</span>;
        },
        isPadded: true
      },
      {
        key: 'column4',
        name: 'Modified By',
        fieldName: 'modifiedBy',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'string',
        onColumnClick: this._onColumnClick,
        onRender: (item: IDocument) => {
          return <span>{item.modifiedBy}</span>;
        },
        isPadded: true
      },
      {
        key: 'fileSize',
        name: 'File Size',
        fieldName: 'fileSizeRaw',
        minWidth: 70,
        maxWidth: 90,
        isResizable: true,
        isCollapsible: true,
        data: 'number',
        onColumnClick: this._onColumnClick,
        onRender: (item: IDocument) => {
          return <span>{item.fileSize}</span>;
        }
      }
    ];

    this._selection = new Selection({
      onSelectionChanged: this._onSelectionChanged.bind(this),
      canSelectItem: (item: IDocument, index?: number) => {
        if (item.fileType === "folder") {
          return false;
        }
        return true;
      },
    });

    this.state = {
      items: [],
      allItems: [],
      allFolders: [],
      columns: columns,
      isModalSelection: false,
      isCompactMode: false,
      loading: false,
      searchValue: "",
      currentServerRelativeUrl: this.props.rootUrl,
      rootDir: true,
      fileUploadStatus: {},
    };
  }

  public componentDidMount() {
    this.props.getDocuments()
      .then((documents) => {
        this.setState(prevState => ({
          items: [...prevState.items, ...documents],
          allItems: documents,
        }));
      });

    this.props.getFolders()
      .then((folders) => {
        this.setState(prevState => ({
          items: [...folders, ...prevState.items],
          allFolders: folders,
        }));
      });
  }

  public componentDidUpdate(previousProps: any, previousState: ILibraryState) {
    if (previousState.isModalSelection !== this.state.isModalSelection && !this.state.isModalSelection) {
      this._selection.setAllSelected(false);
    }
  }

  public render() {
    const { columns, items } = this.state;
    const { isCompactMode, selectionMode } = this.props;

    return (
      <Fabric>
        <div className={classNames.actions}>
          <div className={classNames.searchBoxContainer}>
            <SearchBox
              placeholder="Search"
              value={this.state.searchValue}
              onSearch={this._onChangeText}
              onChange={this._onChangeText}
            // componentRef={this.searchBoxRef}
            />
          </div>
          <div className={classNames.baseActions}>
            {!this.state.rootDir && <div className="backButton">
              <ActionButton iconProps={{ iconName: "Back" }} onClick={this._onBackClick} />
            </div>}
            <div className={classNames.breadcrumb}>
              {/* <Breadcrumb
              style={{ marginTop: 0, fontSize: "12px" }}
              styles={{
                item: {
                  fontSize: "14px"
                }
              }}
              items={[
                { text: 'Files', key: 'Files' },

              ]}
              ariaLabel="Breadcrumb with no maxDisplayedItems"
              overflowAriaLabel="More links"
            /> */}
            </div>
            <UploadStatus fileUploadStatus={this.state.fileUploadStatus} />
            <label>
              <input
                type="file"
                multiple
                className={classNames.uploadField}
                onChange={this._onUpload}
              />
              <div className={classNames.uploadButton}>
                <Icon iconName="Upload" />
                <span>Upload</span>
              </div>
            </label>
            <ActionButton
              iconProps={{ iconName: "OpenInNewWindow" }}
              title="Open as SharePoint document library"
              href={`${this.state.currentServerRelativeUrl}`}
              target="_blank"
              data-interception="off"
            />
          </div>
        </div>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            compact={isCompactMode}
            columns={columns}
            selectionMode={selectionMode || SelectionMode.none}
            getKey={this._getKey}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            onItemInvoked={this._onItemInvoked}
            enterModalSelectionOnTouch={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
            styles={{
              focusZone: {
                cursor: "pointer",
                userSelect: "none",
              }
            }}
          />
        </MarqueeSelection>

      </Fabric>
    );
  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }

  private _onChangeCompactMode(ev: React.MouseEvent<HTMLElement>, checked: boolean) {
    this.setState({ isCompactMode: checked });
  }

  private _onChangeModalSelection(ev: React.MouseEvent<HTMLElement>, checked: boolean) {
    this.setState({ isModalSelection: checked });
  }

  private _onChangeText(text: string) {
    this.setState(prevState => ({
      searchValue: text,
      items: text ?
        [
          ...prevState.allFolders.filter(i => i.name.toLowerCase().indexOf(text) > -1),
          ...prevState.allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1)
        ]
        : prevState.allItems
    }));
  }

  private async _onItemInvoked(item: IDocument): Promise<void> {
    if (item.fileType === "folder") {
      this.setState({ loading: true });
      const documents = await this.props.getDocuments(item.serverRelativeUrl);
      const folders = await this.props.getFolders(item.serverRelativeUrl);
      this.setState(prevState => ({
        items: [...folders, ...documents],
        allFolders: folders,
        allItems: documents,
        loading: false,
        searchValue: "",
        currentServerRelativeUrl: item.serverRelativeUrl,
        rootDir: this.props.rootUrl === item.serverRelativeUrl,
      }));
    }
  }

  private async _onBackClick() {
    this.setState({ loading: true });
    const currentServerRelativeUrl = this.state.currentServerRelativeUrl.slice(0, this.state.currentServerRelativeUrl.lastIndexOf("/"));
    const rootDir = this.props.rootUrl === currentServerRelativeUrl;
    const documents = await this.props.getDocuments(currentServerRelativeUrl);
    const folders = await this.props.getFolders(currentServerRelativeUrl);

    this.setState(prevState => ({
      items: [...folders, ...documents],
      allFolders: folders,
      allItems: documents,
      loading: false,
      searchValue: "",
      currentServerRelativeUrl,
      rootDir,
    }));
  }

  private _onSelectionChanged() {
    const selection = this._selection.getSelection()[0];
    this.props.onSelect((selection && selection["serverRelativeUrl"]) || "");
  }

  private async _onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [];
    const uploadInfo = {};
    for (var i = 0; i < e.currentTarget.files.length; i++) {
      const file = e.currentTarget.files[i];
      files.push(file);
      uploadInfo[file.name] = {
        name: file.name,
        status: FileUploadStatus.Pending,
      };
    }

    this.setState(prevState => ({
      fileUploadStatus: uploadInfo
    }));

    for (const file of files) {
      this.setState(prevState => ({
        fileUploadStatus: {
          ...prevState.fileUploadStatus,
          [file.name]: {
            ...prevState.fileUploadStatus[file.name],
            status: FileUploadStatus.Uploading
          }
        }
      }));
      let errorMessage: string;
      try {
        const response = await this.props.uploadDocument(file, this.state.currentServerRelativeUrl);
        this.setState(prevState => ({
          allItems: [...prevState.allItems, response],
          items: [...prevState.items, response],
        }));
      } catch (error) {
        errorMessage = error.message;
      }
      this.setState(prevState => ({
        fileUploadStatus: {
          ...prevState.fileUploadStatus,
          [file.name]: {
            ...prevState.fileUploadStatus[file.name],
            status: errorMessage ? FileUploadStatus.Failed : FileUploadStatus.Completed,
            errorMessage,
          }
        }
      }));
    }
  }

  private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems
    });
  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export default Library;
