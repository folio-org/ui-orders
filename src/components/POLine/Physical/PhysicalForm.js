import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import {
  FieldMaterialSupplier,
  FieldMaterialType,
  FieldReceiptDue,
  FieldExpectedReceiptDate,
  FieldsVolume,
} from '../../../common/POLFields';
import { isWorkflowStatusOpen } from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const PhysicalForm = ({ order, materialTypes, vendors, formValues }) => {
  const isOpenedOrder = isWorkflowStatusOpen(order);

  return (
    <Row>
      <Col xs={6}>
        <FieldMaterialSupplier
          vendors={vendors}
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6}>
        <FieldReceiptDue />
      </Col>
      <Col xs={6}>
        <FieldExpectedReceiptDate />
      </Col>
      <Col xs={6}>
        <InventoryRecordTypeSelectField
          label="ui-orders.physical.createInventory"
          name="physical.createInventory"
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6}>
        <FieldMaterialType
          materialTypes={materialTypes}
          name="physical.materialType"
          required={isMaterialTypeRequired(formValues, 'physical.createInventory')}
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6}>
        <FieldsVolume disabled={isOpenedOrder} />
      </Col>
    </Row>
  );
};

PhysicalForm.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  order: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default PhysicalForm;
