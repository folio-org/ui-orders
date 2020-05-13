import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FieldDatepicker,
} from '@folio/stripes-acq-components';

import {
  FieldMaterialType,
  FieldMaterialSupplier,
} from '../../../common/POLFields';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
} from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const OtherForm = ({ order, materialTypes, formValues, dispatch, change }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isClosedOrder = isWorkflowStatusClosed(order);

  return (
    <Row>
      <Col
        xs={6}
        md={3}
      >
        <FieldMaterialSupplier
          materialSupplierId={formValues?.physical?.materialSupplier}
          disabled={isClosedOrder}
          dispatch={dispatch}
          change={change}
        />
      </Col>
      <Col
        xs={6}
        md={3}
      >
        <FieldDatepicker
          label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
          name="physical.receiptDue"
        />
      </Col>
      <Col
        xs={6}
        md={3}
      >
        <FieldDatepicker
          label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
          name="physical.expectedReceiptDate"
        />
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
  );
};

OtherForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  order: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
};

export default OtherForm;
