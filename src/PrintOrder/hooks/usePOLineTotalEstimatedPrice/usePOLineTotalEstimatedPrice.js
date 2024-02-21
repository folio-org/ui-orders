import { useOkapiKy, useStripes } from '@folio/stripes/core';

export const usePOLineTotalEstimatedPrice = () => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const systemCurrency = stripes.currency;

  const getCurrencyRate = async (from) => {
    const currencyRate = await ky.get(`finance/exchange-rate?from=${from}&to=${systemCurrency}`).json().catch(() => ({}));

    return currencyRate?.exchangeRate;
  };

  const getPOLineTotalEstimatedPrice = async ({ poLine = {} }) => {
    const {
      currency,
      exchangeRate,
      poLineEstimatedPrice,
      quantityElectronic = 0,
      quantityPhysical = 0,
    } = poLine;

    let currentExchangeRate = exchangeRate;

    if (currency !== systemCurrency && !exchangeRate) {
      currentExchangeRate = await getCurrencyRate(currency);
    }

    return {
      totalItems: quantityPhysical + quantityElectronic,
      totalEstimatedPrice: currentExchangeRate ? (poLineEstimatedPrice * currentExchangeRate) : poLineEstimatedPrice,
    };
  };

  return {
    getPOLineTotalEstimatedPrice,
    getCurrencyRate,
  };
};
