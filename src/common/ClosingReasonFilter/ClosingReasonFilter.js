import React from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { SelectionFilter } from '@folio/stripes-acq-components';

import { useCloseReasonOptions } from '../hooks';
import { closingReasonsShape } from '../shapes';

const ClosingReasonFilter = ({ closingReasons, intl: { formatMessage }, ...rest }) => {
  const translatedReasonsOptions = useCloseReasonOptions(formatMessage, closingReasons);

  return (
    <SelectionFilter
      {...rest}
      options={translatedReasonsOptions}
    />
  );
};

ClosingReasonFilter.propTypes = {
  closingReasons: closingReasonsShape,
  intl: intlShape.isRequired,
};

export default injectIntl(ClosingReasonFilter);
