import React from 'react';
import { render, screen } from '@testing-library/react';

import { RolloverAdjustmentAmount } from './RolloverAdjustmentAmount';

const defaultProps = {
  currency: 'USD',
  amount: 12.34,
};

const renderRolloverAdjustmentAmount = (props = {}) => render(
  <RolloverAdjustmentAmount
    {...defaultProps}
    {...props}
  />,
);

describe('RolloverAdjustmentAmount', () => {
  it('should render adjustment amount', () => {
    renderRolloverAdjustmentAmount();

    expect(screen.getByText('$12.34')).toBeInTheDocument();
  });
});
