import * as React from 'react';
import { IDocumentLibraryState } from './IDocumentLibraryState';
import { IDocumentLibraryProps } from './IDocumentLibraryProps';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import Library, { IDocument } from './Library/Library';
import URL from './URL/URL';
import Upload from './Upload/Upload';
import { sp } from '@pnp/sp';
import fileSize from '../../../helpers/fileSize';
import { SelectionMode } from '@uifabric/utilities';
import { CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { Pages, extensions } from '../../../types';

const classNames = mergeStyleSets({
  footer: {
    padding: 0,
    fontSize: '16px'
  },
});

export interface IFile {
  Length: string;
  Level: number;
  Name: string;
  ServerRelativeUrl: string;
  TimeCreated: Date;
  TimeLastModified: string;
  UniqueId: string;
  Editor: {
    ID: number;
    Title: string;
  };
  Author: {
    ID: number;
    Title: string;
  };
}
export interface IFolder {
  Name?: string;
  ServerRelativeUrl?: string;
  UniqueId?: string;
  ItemCount?: number;
  ShareUrl?: string;
}

class DocumentLibrary extends React.Component<IDocumentLibraryProps, IDocumentLibraryState> {
  constructor(props) {
    super(props);
    this.state = {
    };

    this._uploadDocument = this._uploadDocument.bind(this);
    this._getDocuments = this._getDocuments.bind(this);
    this._getFolders = this._getFolders.bind(this);
  }

  public componentDidMount() {
    this._getDocuments();
  }

  public render(): JSX.Element {
    return (
      <div>
        {this._content()}
      </div>
    );
  }

  private _content() {
    switch (this.props.page) {
      case Pages.library:
        return <Library
          getDocuments={this._getDocuments}
          getFolders={this._getFolders}
          selectionMode={SelectionMode.single}
          uploadDocument={this._uploadDocument}
          rootUrl={this.props.rootUrl}
          onSelect={this.props.onSelect}
        />;
      case Pages.url:
        return <URL />;
      case Pages.upload:
        return <Upload />;

      default:
        return null;
    }
  }



  private async _getDocuments(serverRelativeUrl?: string): Promise<IDocument[]> {
    let folder = sp.web.getFolderByServerRelativeUrl(serverRelativeUrl || this.props.rootUrl);

    const files: IFile[] = await folder
      .files
      .select("Length,Level,Name,ServerRelativeUrl,TimeCreated,TimeLastModified,UniqueId,Editor/ID,Editor/Title,Author/ID,Author/Title")
      .expand("Editor, Author")
      .get();
    let documents: IDocument[] = files
      .map(file => {
        let fileType = file.ServerRelativeUrl.slice(file.ServerRelativeUrl.lastIndexOf(".") + 1);
        fileType = fileType && fileType.toLowerCase();
        return {
          key: file.UniqueId,
          name: file.Name,
          value: file.Name,
          // iconName: string,
          serverRelativeUrl: file.ServerRelativeUrl,
          fileType,
          modifiedBy: file.Editor && file.Editor.Title || (file.Author && file.Author.Title),
          dateModified: file.TimeLastModified && new Date(file.TimeLastModified).toLocaleString(),
          // dateModifiedValue: number,
          fileSize: fileSize(Number(file.Length)),
          fileSizeRaw: Number(file.Length),
        };
      });

    if (this.props.fileType) {
      documents = documents.filter(document => extensions[this.props.fileType].some(ext => ext === document.fileType));
    }

    if (this.props.extensions && this.props.extensions.length) {
      documents = documents.filter(document => this.props.extensions.some(ext => ext === document.fileType));
    }

    return documents;
  }

  private async _getFolders(serverRelativeUrl?: string): Promise<IDocument[]> {
    const files: IFolder[] = await sp.web
      .getFolderByServerRelativeUrl(serverRelativeUrl || this.props.rootUrl)
      .folders
      .get();
    const documents: IDocument[] = files.map(file => {
      return {
        key: file.UniqueId,
        name: file.Name,
        value: file.Name,
        // iconName: string,
        serverRelativeUrl: file.ServerRelativeUrl,
        fileType: "folder",
        modifiedBy: "",
        dateModified: null,
        // dateModifiedValue: number,
        fileSize: "",
        fileSizeRaw: null,
        // canSelect: false,
        // checkboxVisibility: CheckboxVisibility.hidden,
      };
    });

    return documents;
  }

  private async _uploadDocument(file: File, relativeUrl: string) {
    try {
      const response = await sp.web.getFolderByServerRelativeUrl(`!@p1::${relativeUrl}`)
        .files
        .add(`!@p2::${file.name}`, file, false);
      const fileResponse = response.data;
      const fileType = fileResponse.ServerRelativeUrl.slice(fileResponse.ServerRelativeUrl.lastIndexOf(".") + 1);
      return {
        key: fileResponse.UniqueId,
        name: fileResponse.Name,
        value: fileResponse.Name,
        // iconName: string,
        serverRelativeUrl: fileResponse.ServerRelativeUrl,
        fileType,
        modifiedBy: fileResponse.Editor && fileResponse.Editor.Title || (fileResponse.Author && fileResponse.Author.Title),
        dateModified: fileResponse.TimeLastModified && new Date(fileResponse.TimeLastModified).toLocaleString(),
        // dateModifiedValue: number,
        fileSize: fileSize(Number(fileResponse.Length)),
        fileSizeRaw: Number(fileResponse.Length),
      };
    } catch (error) {
      const parsedErrorMessage = JSON.parse(error.message.substr(error.message.indexOf("{")))["odata.error"].message.value;
      throw new Error(parsedErrorMessage);
    }
  }
}

export default DocumentLibrary;
