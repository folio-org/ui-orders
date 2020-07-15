import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldMaterialSupplier,
  FieldMaterialType,
  FieldReceiptDue,
  FieldExpectedReceiptDate,
} from '../../../../common/POLFields';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLineOtherResourcesForm = ({ materialTypes, change, formValues }) => {
  return (
    <>
      <Row>
        <Col
          xs={3}
          data-col-order-template-other-resources-material-supplier
        >
          <FieldMaterialSupplier
            materialSupplierId={formValues?.physical?.materialSupplier}
            change={change}
          />
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-receipt-due
        >
          <FieldReceiptDue />
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-expected-receipt-date
        >
          <FieldExpectedReceiptDate />
        </Col>

        <Col xs={3}>
          <InventoryRecordTypeSelectField
            label="ui-orders.physical.createInventory"
            name="physical.createInventory"
          />
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-material-type
        >
          <FieldMaterialType
            materialTypes={materialTypes}
            name="physical.materialType"
          />
        </Col>
      </Row>
    </>
  );
};

POLineOtherResourcesForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
};

export default POLineOtherResourcesForm;
