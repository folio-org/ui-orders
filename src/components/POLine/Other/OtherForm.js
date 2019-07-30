import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Col,
  Datepicker,
  Row,
  Select,
} from '@folio/stripes/components';

import {
  FieldMaterialType,
} from '../../../common/POLFields';
import { isRequiredWithFieldValue, isWorkflowStatusOpen } from '../../PurchaseOrder/util';
import {
  EMPTY_OPTION,
  DATE_FORMAT,
  TIMEZONE,
} from '../../Utils/const';
import { INVENTORY_RECORDS_TYPE } from '../const';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import normalizeEmptySelect from '../../Utils/normalizeEmptySelect';

const OtherForm = ({ order, materialTypes, vendors, formValues }) => {
  const isOpenedOrder = isWorkflowStatusOpen(order);

  return (
    <Row>
      <Col xs={6}>
        <Field
          component={Select}
          dataOptions={[EMPTY_OPTION, ...vendors]}
          fullWidth
          label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
          name="physical.materialSupplier"
          normalize={normalizeEmptySelect}
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6}>
        <Field
          backendDateStandard={DATE_FORMAT}
          component={Datepicker}
          dateFormat={DATE_FORMAT}
          fullWidth
          label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
          name="physical.receiptDue"
          timeZone={TIMEZONE}
        />
      </Col>
      <Col xs={6}>
        <Field
          backendDateStandard={DATE_FORMAT}
          component={Datepicker}
          dateFormat={DATE_FORMAT}
          fullWidth
          label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
          name="physical.expectedReceiptDate"
          timeZone={TIMEZONE}
        />
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
          required={isRequiredWithFieldValue(formValues, 'physical.createInventory', INVENTORY_RECORDS_TYPE.all)}
          disabled={isOpenedOrder}
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
