import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Selection } from '@folio/stripes/components';

import { addEmptyOption } from '../../components/PurchaseOrder/util';

const TETHER_CONFIG = {
  attachment: 'middle center',
};

export const filterValues = (value, dataOptions) => dataOptions.filter(({ label }) => {
  return !value || label.includes(value);
});

const FieldSelection = ({ dataOptions, labelId, ...rest }) => (
  <Field
    dataOptions={rest.required ? dataOptions : addEmptyOption(dataOptions)}
    disabled={rest.readOnly}
    fullWidth
    label={<FormattedMessage id={labelId} />}
    tether={TETHER_CONFIG}
    component={Selection}
    onFilter={filterValues}
    {...rest}
  />
);

FieldSelection.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default FieldSelection;
