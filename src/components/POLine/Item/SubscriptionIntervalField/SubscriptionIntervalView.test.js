import React from 'react';
import { render, screen } from '@testing-library/react';

import SubscriptionIntervalView from './SubscriptionIntervalView';

const defaultProps = {
  value: 42,
};

const renderSubscriptionIntervalView = (props = {}) => render(
  <SubscriptionIntervalView
    {...defaultProps}
    {...props}
  />,
);

describe('SubscriptionIntervalView', () => {
  it('should render \'subscription interval\' field', () => {
    renderSubscriptionIntervalView();

    expect(screen.getByText(defaultProps.value)).toBeInTheDocument();
  });
});
