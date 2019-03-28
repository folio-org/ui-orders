import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import {
  Col,
  Datepicker,
  Row,
  Select,
} from '@folio/stripes/components';

import {
  DATE_FORMAT,
  TIMEZONE,
} from '../../Utils/const';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import VolumesForm from './VolumesForm';

const PhysicalForm = ({ vendors }) => (
  <Row>
    <Col xs={6}>
      <FormattedMessage id="ui-orders.dropdown.select">
        {(placeholder) => (
          <Field
            component={Select}
            dataOptions={[{ label: placeholder, value: '' }, ...vendors]}
            fullWidth
            label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
            name="physical.materialSupplier"
            normalize={(value) => {
              return value === ''
                ? null
                : value;
            }}
          />
        )}
      </FormattedMessage>
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
      <VolumesForm />
    </Col>
    <Col xs={6}>
      <InventoryRecordTypeSelectField
        label="ui-orders.physical.createInventory"
        name="physical.createInventory"
      />
    </Col>
  </Row>
);

PhysicalForm.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default PhysicalForm;
