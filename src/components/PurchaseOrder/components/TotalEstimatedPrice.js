import groupBy from 'lodash/groupBy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  getAmountWithCurrency,
  getMoneyMultiplier,
} from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';
import { KeyValue } from '@folio/stripes/components';

const getTotalEstimatedPriceFromPOLines = (orderLines, stripes) => {
  const groupedByCurrency = groupBy(orderLines, (line) => line.cost.currency);

  const totalEstimatedPrices = Object.entries(groupedByCurrency).map(([currency, lines]) => {
    const multiplier = getMoneyMultiplier(currency); // to avoid float point precision issues

    const total = lines.reduce((acc, line) => {
      return ((acc * multiplier) + ((line?.cost?.poLineEstimatedPrice || 0) * multiplier)) / multiplier;
    }, 0);

    return [currency, getAmountWithCurrency(stripes.locale, currency, total)];
  });

  return totalEstimatedPrices
    .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB))
    .map(([currency, formattedAmount]) => `${currency} ${formattedAmount}`)
    .join(', ') || getAmountWithCurrency(stripes.locale, stripes.currency, 0);
};

export const TotalEstimatedPrice = ({ orderLines }) => {
  const stripes = useStripes();

  const value = useMemo(() => {
    return getTotalEstimatedPriceFromPOLines(orderLines, stripes);
  }, [orderLines, stripes]);

  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.orderSummary.totalEstimatedPrice" />}
      value={value}
    />
  );
};

TotalEstimatedPrice.propTypes = {
  orderLines: PropTypes.arrayOf(PropTypes.shape({
    cost: PropTypes.shape({
      currency: PropTypes.string,
      poLineEstimatedPrice: PropTypes.number,
    }),
  })),
};

TotalEstimatedPrice.displayName = 'TotalEstimatedPrice';
