import React, { Fragment } from 'react';
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
  FieldsVolume,
} from '../../../../common/POLFields';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLinePhysicalForm = ({ materialTypes, dispatch, change, formValues }) => {
  return (
    <Fragment>
      <Row>
        <Col
          xs={3}
          data-col-order-template-fresources-material-supplier
        >
          <FieldMaterialSupplier
            materialSupplierId={formValues?.physical?.materialSupplier}
            dispatch={dispatch}
            change={change}
          />
        </Col>

        <Col
          xs={3}
          data-col-order-template-fresources-receipt-due
        >
          <FieldReceiptDue />
        </Col>

        <Col
          xs={3}
          data-col-order-template-fresources-expected-receipt-date
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
          data-col-order-template-fresources-material-type
        >
          <FieldMaterialType
            materialTypes={materialTypes}
            name="physical.materialType"
          />
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
    </Fragment>
  );
};

POLinePhysicalForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

export default POLinePhysicalForm;
