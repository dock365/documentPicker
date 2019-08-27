import * as React from 'react';
import { IURLState } from './IURLState';
import { IURLProps } from './IURLProps';

class URL extends React.Component<IURLProps, IURLState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    return (
      <div>
        <h3>URL Component!</h3>
      </div>
    );
  }
}

export default URL;
