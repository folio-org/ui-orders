import PropTypes from 'prop-types';

import { FundDistributionView } from '@folio/stripes-acq-components';

export const FundDistributionVersionView = ({ version }) => {
  const cost = version?.cost;

  const mclProps = {
    visibleColumns: ['name', 'expenseClass', 'value', 'amount'],
  };

  return (
    <FundDistributionView
      currency={cost?.currency}
      fundDistributions={version?.fundDistribution}
      totalAmount={cost?.poLineEstimatedPrice}
      mclProps={mclProps}
    />
  );
};

FundDistributionVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
