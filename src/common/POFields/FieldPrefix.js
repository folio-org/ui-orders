import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  FieldSelectFinal as FieldSelect,
  fieldSelectOptionsShape,
} from '@folio/stripes-acq-components';

const FieldPrefix = ({ prefixes, ...rest }) => {
  return (
    <FieldSelect
      label={<FormattedMessage id="ui-orders.orderDetails.orderNumberPrefix" />}
      name="poNumberPrefix"
      dataOptions={prefixes}
      validateFields={[]}
      {...rest}
    />
  );
};

FieldPrefix.propTypes = {
  prefixes: fieldSelectOptionsShape.isRequired,
  isNonInteractive: PropTypes.bool,
};

export default FieldPrefix;
