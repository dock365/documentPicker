import * as React from 'react';
import { IDocumentPickerPageState } from './IDocumentPickerPageState';
import { IDocumentPickerPageProps } from './IDocumentPickerPageProps';
import { ActionButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType, IPanelProps, IPanelHeaderRenderer } from 'office-ui-fabric-react/lib/Panel';
import DocumentLibrary from './DocumentLibrary/DocumentLibrary';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { mergeStyleSets, getTheme, createFontStyles } from 'office-ui-fabric-react/lib/Styling';
import { Pages } from '../../types';
const theme = getTheme();
const classNames = mergeStyleSets({
  navItem: {
    borderBottom: "solid 2px transparent",
  },
  activeNav: {
    borderBottom: `solid 2px ${theme.palette.themePrimary}`,
    backgroundColor: "#fff",
  },
  panelHeaderText: {
    fontSize: "1.5em",
    margin: "10px 20px",
    fontWeight: 700,
  }
});

class DocumentPickerPage extends React.Component<IDocumentPickerPageProps, IDocumentPickerPageState> {
  constructor(props) {
    super(props);
    this.state = {
      showPanel: false,
      selected: "",
      page: Pages.library,
    };

    this._onSelect = this._onSelect.bind(this);
    this._onSave = this._onSave.bind(this);
    this._onClose = this._onClose.bind(this);
    this._onRenderFooterContent = this._onRenderFooterContent.bind(this);
    this._onRenderHeaderContent = this._onRenderHeaderContent.bind(this);
    this._onCommandBarItemClick = this._onCommandBarItemClick.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div >
        <ActionButton text="Select" onClick={() => this.setState({ showPanel: true })} />
        <Panel
          isOpen={this.state.showPanel}
          onDismiss={() => this.setState({ showPanel: false })}
          type={PanelType.large}
          onRenderFooterContent={this._onRenderFooterContent}
          onRenderHeader={this._onRenderHeaderContent}
          headerText={this.props.headerText}
        >
          <DocumentLibrary
            onSelect={this._onSelect}
            page={this.state.page}
            rootUrl={this.props.rootUrl}
            extensions={this.props.extensions}
            fileType={this.props.fileType}
          />
        </Panel>
      </div>
    );
  }

  private _onRenderFooterContent() {
    return (
      <div>
        <PrimaryButton
          style={{ marginRight: '8px' }}
          text="Select"
          onClick={this._onSave}
          disabled={!this.state.selected}
        />
        <DefaultButton
          text="Close"
          onClick={this._onClose}
        />

      </div>
    );
  }

  private _onRenderHeaderContent(props?: IPanelProps) {
    return (
      <React.Fragment>
        {props.headerText && <h3 className={classNames.panelHeaderText}>{props.headerText}</h3>}
        <CommandBar
          items={this.getItems()}
          farItems={this.getFarItems()}
        />
      </React.Fragment>
    )
  }

  private _onSelect(value: string) {
    this.setState({ selected: value });
    console.log(value);
  }

  private _onSave(e: React.MouseEvent<HTMLButtonElement>) {
    debugger
    this.setState({ showPanel: false });
  }

  private _onClose() {
    this.setState({ showPanel: false });
  }

  private getItems(): ICommandBarItemProps[] {
    return [
      {
        key: Pages.library,
        name: 'Library',
        iconProps: {
          iconName: 'FolderHorizontal'
        },
        className: this.state.page === Pages.library ? classNames.activeNav : classNames.navItem,
        onClick: this._onCommandBarItemClick
      },
      {
        key: Pages.url,
        name: 'Custom URL',
        iconProps: {
          iconName: 'Link'
        },
        className: this.state.page === Pages.url ? classNames.activeNav : classNames.navItem,
        onClick: this._onCommandBarItemClick
      },
    ];
  }


  private getFarItems() {
    return [
      // {
      //   key: 'sort',
      //   name: 'Sort',
      //   ariaLabel: 'Sort',
      //   iconProps: {
      //     iconName: 'SortLines'
      //   },
      //   onClick: () => console.log('Sort')
      // },
      // {
      //   key: 'tile',
      //   name: 'Grid view',
      //   ariaLabel: 'Grid view',
      //   iconProps: {
      //     iconName: 'Tiles'
      //   },
      //   iconOnly: true,
      //   onClick: () => console.log('Tiles')
      // },
      // {
      //   key: 'info',
      //   name: 'Info',
      //   ariaLabel: 'Info',
      //   iconProps: {
      //     iconName: 'Info'
      //   },
      //   iconOnly: true,
      //   onClick: () => console.log('Info')
      // }
    ];
  }

  private _onCommandBarItemClick(ev, item?: IContextualMenuItem & { key: Pages }) {
    this.setState({ page: item.key });
  }
}

export default DocumentPickerPage;
