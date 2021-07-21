import { getHoldingLocationName } from '../../utils';

export const getHoldingOptions = (holdings = [], locationsMap = {}) => (
  holdings.map(holding => ({
    value: holding.id,
    label: getHoldingLocationName(holding, locationsMap),
  }))
);
