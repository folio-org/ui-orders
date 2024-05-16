import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { VisibilityControl } from '@folio/stripes-acq-components';

import {
  FieldMaterialSupplier,
  FieldMaterialType,
  FieldReceiptDue,
  FieldExpectedReceiptDate,
  FieldsVolume,
} from '../../../../common/POLFields';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLinePhysicalForm = ({ materialTypes, change, formValues }) => {
  return (
    <>
      <Row>
        <Col
          xs={3}
          data-col-order-template-fresources-material-supplier
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
          data-col-order-template-fresources-receipt-due
        >
          <VisibilityControl name="hiddenFields.physical.receiptDue">
            <FieldReceiptDue />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-fresources-expected-receipt-date
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
              disabled={formValues?.details?.isBindaryActive}
            />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-fresources-material-type
        >
          <VisibilityControl name="hiddenFields.physical.materialType">
            <FieldMaterialType
              materialTypes={materialTypes}
              name="physical.materialType"
            />
          </VisibilityControl>
        </Col>
      </Row>

      <Row start="xs">
        <Col
          xs={3}
          data-col-order-template-fresources-volumes
        >
          <FieldsVolume />
        </Col>
      </Row>
    </>
  );
};

POLinePhysicalForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
};

export default POLinePhysicalForm;
