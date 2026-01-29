import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  IconButton,
  InfoPopover,
  KeyValue,
  Layout,
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
      <Layout className="flex">
        <AmountWithCurrencyField
          currency={currency}
          amount={amount}
        />
        {typeof onClear === 'function' && (
          <IconButton
            data-testid="clear-rollover-adjustment-amount"
            disabled={!amount}
            icon="times-circle-solid"
            iconSize="small"
            onClick={onClear}
          />
        )}
      </Layout>
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
