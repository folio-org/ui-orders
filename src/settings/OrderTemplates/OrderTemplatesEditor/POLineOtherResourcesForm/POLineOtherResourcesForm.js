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
import { VisibilityControl } from '../../../../common/VisibilityControl';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLineOtherResourcesForm = ({ materialTypes, change, formValues }) => {
  return (
    <>
      <Row>
        <Col
          xs={3}
          data-col-order-template-other-resources-material-supplier
        >
          <VisibilityControl name="hiddenFields.physical.materialSupplier">
            <FieldMaterialSupplier
              materialSupplierId={formValues?.physical?.materialSupplier}
              change={change}
            />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-receipt-due
        >
          <VisibilityControl name="hiddenFields.physical.receiptDue">
            <FieldReceiptDue />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-expected-receipt-date
        >
          <VisibilityControl name="hiddenFields.physical.expectedReceiptDate">
            <FieldExpectedReceiptDate />
          </VisibilityControl>
        </Col>

        <Col xs={3}>
          <VisibilityControl name="hiddenFields.physical.createInventory">
            <InventoryRecordTypeSelectField
              label="ui-orders.physical.createInventory"
              name="physical.createInventory"
            />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-material-type
        >
          <VisibilityControl name="hiddenFields.physical.materialType">
            <FieldMaterialType
              materialTypes={materialTypes}
              name="physical.materialType"
            />
          </VisibilityControl>
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
