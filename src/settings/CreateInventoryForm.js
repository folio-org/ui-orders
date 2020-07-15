import React, { Fragment } from 'react';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import InventoryRecordTypeSelectField from './InventoryRecordTypeSelectField';

const CreateInventoryForm = () => (
  <Fragment>
    <Row>
      <Col xs={6}>
        <InventoryRecordTypeSelectField
          isRedux
          label="ui-orders.settings.createInventory.eresource"
          name="eresource"
          required
        />
      </Col>
    </Row>
    <Row>
      <Col xs={6}>
        <InventoryRecordTypeSelectField
          isRedux
          label="ui-orders.settings.createInventory.physical"
          name="physical"
          required
        />
      </Col>
    </Row>
    <Row>
      <Col xs={6}>
        <InventoryRecordTypeSelectField
          isRedux
          label="ui-orders.settings.createInventory.other"
          name="other"
          required
        />
      </Col>
    </Row>
  </Fragment>
);

export default CreateInventoryForm;
