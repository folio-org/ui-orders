import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  KeyValue,
  Label,
  Loading,
} from '@folio/stripes/components';

import {
  baseManifest,
  EXCHANGE_RATE_API,
} from '@folio/stripes-acq-components';

const ExchangeRateValue = ({
  exchangeFrom,
  exchangeTo,
  mutator,
  manualExchangeRate,
  labelId,
}) => {
  const [exchangeRate, setExchangeRate] = useState();
  const label = <FormattedMessage id={labelId} />;

  useEffect(
    () => {
      setExchangeRate();

      if (!manualExchangeRate) {
        mutator.exchangeRate.GET({
          params: {
            from: exchangeFrom,
            to: exchangeTo,
          },
        })
          .then(setExchangeRate)
          .catch(() => {
            setExchangeRate({});
          });
      } else setExchangeRate({ exchangeRate: manualExchangeRate });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manualExchangeRate, exchangeFrom, exchangeTo],
  );

  if (!exchangeRate) {
    return (
      <>
        <Label>
          {label}
        </Label>
        <Loading />
      </>
    );
  }

  return (
    <KeyValue
      label={label}
      value={exchangeRate?.exchangeRate}
    />
  );
};

ExchangeRateValue.manifest = Object.freeze({
  exchangeRate: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    path: EXCHANGE_RATE_API,
  },
});

ExchangeRateValue.propTypes = {
  exchangeFrom: PropTypes.string.isRequired,
  exchangeTo: PropTypes.string.isRequired,
  manualExchangeRate: PropTypes.number,
  labelId: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ExchangeRateValue);
