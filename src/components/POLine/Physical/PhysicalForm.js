import React, { Fragment } from 'react';
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
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const PhysicalForm = ({ order, materialTypes, vendors, formValues }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);

  return (
    <Fragment>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldMaterialSupplier
            vendors={vendors}
            disabled={isPostPendingOrder}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldReceiptDue />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldExpectedReceiptDate />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <InventoryRecordTypeSelectField
            label="ui-orders.physical.createInventory"
            name="physical.createInventory"
            disabled={isPostPendingOrder}
            required
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldMaterialType
            materialTypes={materialTypes}
            name="physical.materialType"
            required={isMaterialTypeRequired(formValues, 'physical.createInventory')}
            disabled={isPostPendingOrder}
          />
        </Col>
      </Row>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldsVolume disabled={isPostPendingOrder} />
        </Col>
      </Row>
    </Fragment>
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
