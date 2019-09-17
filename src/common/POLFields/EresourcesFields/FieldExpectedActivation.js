import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepicker } from '@folio/stripes-acq-components';

const FieldExpectedActivation = () => {
  return (
    <FieldDatepicker
      label={<FormattedMessage id="ui-orders.eresource.expectedActivation" />}
      name="eresource.expectedActivation"
    />
  );
};

export default FieldExpectedActivation;
