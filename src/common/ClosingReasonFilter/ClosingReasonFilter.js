import React from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { SelectionFilter } from '@folio/stripes-acq-components';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../constants';
import { getClosingReasonsOptions } from '../utils';
import { closingReasonsShape } from '../shapes';

const ClosingReasonFilter = ({ closingReasons, intl: { formatMessage }, ...rest }) => {
  const reasons = getClosingReasonsOptions(closingReasons);
  const translatedReasonsOptions = reasons.map(({ label, value }) => ({
    label: formatMessage({
      id: `ui-orders.closeOrderModal.closingReasons.${DEFAULT_CLOSE_ORDER_REASONS[label]}`,
      defaultMessage: label,
    }),
    value,
  }));

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
