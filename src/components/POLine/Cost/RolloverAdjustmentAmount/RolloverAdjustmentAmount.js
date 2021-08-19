import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  InfoPopover,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
} from '@folio/stripes-acq-components';

export const RolloverAdjustmentAmount = ({ currency, amount }) => {
  return (
    <KeyValue
      label={
        <div>
          <span>
            <FormattedMessage id="ui-orders.cost.rolloverAdjustment" />
          </span>
          <InfoPopover
            buttonLabel={<FormattedMessage id="ui-orders.cost.buttonLabel" />}
            content={<FormattedMessage id="ui-orders.cost.rolloverAdjustment.info" />}
          />
        </div>
      }
    >
      <AmountWithCurrencyField
        currency={currency}
        amount={amount}
      />
    </KeyValue>
  );
};

RolloverAdjustmentAmount.propTypes = {
  currency: PropTypes.string,
  amount: PropTypes.number,
};
