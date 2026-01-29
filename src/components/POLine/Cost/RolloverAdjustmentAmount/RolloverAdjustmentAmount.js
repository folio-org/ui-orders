import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IconButton,
  InfoPopover,
  KeyValue,
} from '@folio/stripes/components';
import { AmountWithCurrencyField } from '@folio/stripes-acq-components';

export const RolloverAdjustmentAmount = ({
  amount,
  component,
  currency,
  name,
  onClear,
}) => {
  const KeyValueComponent = component || KeyValue;

  return (
    <KeyValueComponent
      name={name}
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
      {typeof onClear === 'function' && (
        <IconButton
          icon="times-circle-solid"
          iconSize="small"
          onClick={onClear}
        />
      )}
    </KeyValueComponent>
  );
};

RolloverAdjustmentAmount.propTypes = {
  amount: PropTypes.number,
  component: PropTypes.node,
  currency: PropTypes.string,
  name: PropTypes.string,
  onClear: PropTypes.func,
};
