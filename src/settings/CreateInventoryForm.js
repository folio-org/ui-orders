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
          label="ui-orders.settings.createInventory.eresource"
          name="eresource"
        />
      </Col>
    </Row>
    <Row>
      <Col xs={6}>
        <InventoryRecordTypeSelectField
          label="ui-orders.settings.createInventory.physical"
          name="physical"
        />
      </Col>
    </Row>
    <Row>
      <Col xs={6}>
        <InventoryRecordTypeSelectField
          label="ui-orders.settings.createInventory.other"
          name="other"
        />
      </Col>
    </Row>
  </Fragment>
);

export default CreateInventoryForm;
