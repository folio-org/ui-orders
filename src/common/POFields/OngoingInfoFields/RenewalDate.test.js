import React from 'react';
import { render, screen } from '@testing-library/react';

import RenewalDate from './RenewalDate';

const renderRenewalDate = (props = {}) => render(
  <RenewalDate
    {...props}
  />,
);

describe('RenewalDate', () => {
  it('should render renewal date', () => {
    renderRenewalDate({ value: '2012-12-21T00:00:00.000+00:00' });

    expect(screen.getByText('2012-12-21')).toBeInTheDocument();
  });

  it('should render a hyphen if a value is missing', () => {
    renderRenewalDate();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
