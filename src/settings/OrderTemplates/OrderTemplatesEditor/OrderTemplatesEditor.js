import React, { Component } from 'react';

import {
  Pane,
  Layer,
} from '@folio/stripes/components';

class OrderTemplatesEditor extends Component {
  render() {
    return (
      <Layer isOpen>
        <Pane
          id="order-settings-order-templates-editor"
          defaultWidth="fill"
          paneTitle="Order template editor"
          dismissible
        />
      </Layer>
    );
  }
}

export default OrderTemplatesEditor;
