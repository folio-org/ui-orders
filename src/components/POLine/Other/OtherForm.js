import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FieldDatepicker,
  FieldSelect,
} from '@folio/stripes-acq-components';

import {
  FieldMaterialType,
} from '../../../common/POLFields';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import normalizeEmptySelect from '../../Utils/normalizeEmptySelect';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const OtherForm = ({ order, materialTypes, vendors, formValues }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);

  return (
    <Row>
      <Col
        xs={6}
        md={3}
      >
        <FieldSelect
          dataOptions={vendors}
          fullWidth
          label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
          name="physical.materialSupplier"
          normalize={normalizeEmptySelect}
          disabled={isPostPendingOrder}
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

export default OtherForm;
