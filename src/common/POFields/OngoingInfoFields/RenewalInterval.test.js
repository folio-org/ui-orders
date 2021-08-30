import React from 'react';
import { render, screen } from '@testing-library/react';

import RenewalInterval from './RenewalInterval';

const renderRenewalInterval = (props = {}) => render(
  <RenewalInterval
    {...props}
  />,
);

describe('RenewalInterval', () => {
  it('should render renewal interval value', () => {
    const props = { value: 360 };

    renderRenewalInterval(props);

    expect(screen.getByText(props.value)).toBeInTheDocument();
  });

  it('should render a hyphen if a value is missing', () => {
    renderRenewalInterval();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
