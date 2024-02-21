import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { EXCHANGE_RATE_API } from '@folio/stripes-acq-components';

export const usePOLineTotalEstimatedPrice = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const systemCurrency = stripes.currency;

  const getCurrencyRate = async (from) => {
    const currencyRate = await ky
      .get(`${EXCHANGE_RATE_API}?from=${from}&to=${systemCurrency}`)
      .json()
      .then(({ exchangeRate }) => exchangeRate)
      .catch(() => ({}));

    return currencyRate;
  };

  const getPOLineTotalEstimatedPrice = async (poLine = {}) => {
    const {
      currency,
      exchangeRate,
      poLineEstimatedPrice,
    } = poLine;

    let currentExchangeRate = exchangeRate;

    if (currency !== systemCurrency && !exchangeRate) {
      currentExchangeRate = await getCurrencyRate(currency);
    }

    return {
      totalEstimatedPrice: currentExchangeRate ? (poLineEstimatedPrice * currentExchangeRate) : poLineEstimatedPrice,
    };
  };

  return {
    getPOLineTotalEstimatedPrice,
    getCurrencyRate,
  };
};
