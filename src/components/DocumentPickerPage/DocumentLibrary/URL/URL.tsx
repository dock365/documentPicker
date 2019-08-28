import * as React from 'react';
import { IURLState } from './IURLState';
import { IURLProps } from './IURLProps';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { extensions } from '../../../../types';
import urlValidator from '../../../../helpers/urlValidator';

class URL extends React.Component<IURLProps, IURLState> {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.selectedValue,
      errorMessage: "",
    };

    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  public componentDidUpdate(prevProps: IURLProps) {
    if (this.props.selectedValue !== prevProps.selectedValue) {
      this.setState({ value: this.props.selectedValue || "" });
    }
  }

  public render(): JSX.Element {
    return (
      <div style={{ marginTop: "15px" }}>
        <TextField
          label="Enter Custom URL"
          value={this.state.value}
          onChange={this._onChange}
          onBlur={this._onBlur}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  }

  private _onChange(e, value) {
    this.setState({ value });
    const urlExtension = value.slice(value.lastIndexOf(".") + 1);
    if (value && !urlValidator(value)) {
      this.setState({ errorMessage: "Invalid url!" });
      this.props.onSelect("");
      return;
    }
    if (
      (this.props.fileType && !extensions[this.props.fileType].some(ext => ext === urlExtension)) ||
      (this.props.extensions && !this.props.extensions.some(ext => ext === urlExtension))
    ) {
      if (value) {
        this.setState({ errorMessage: "Invalid file type!" });
      } else {
        this.setState({ errorMessage: "" });
      }
      this.props.onSelect("");
    } else {
      this.setState({ errorMessage: "" });
      this.props.onSelect(value);
    }
  }

  private _onBlur() {

  }
}

export default URL;
