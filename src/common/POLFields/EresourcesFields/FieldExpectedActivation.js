import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldDatepickerFinal } from '@folio/stripes-acq-components';

const FieldExpectedActivation = () => {
  return (
    <FieldDatepickerFinal
      label={<FormattedMessage id="ui-orders.eresource.expectedActivation" />}
      name="eresource.expectedActivation"
    />
  );
};

export default FieldExpectedActivation;
