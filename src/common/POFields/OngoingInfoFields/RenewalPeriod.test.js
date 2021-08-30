import React from 'react';
import { render, screen } from '@testing-library/react';

import RenewalPeriod from './RenewalPeriod';

const renderRenewalPeriod = (props = {}) => render(
  <RenewalPeriod
    {...props}
  />,
);

describe('RenewalPeriod', () => {
  it('should render renewal period value', () => {
    const props = { value: 90 };

    renderRenewalPeriod(props);

    expect(screen.getByText(props.value)).toBeInTheDocument();
  });

  it('should render a hyphen if a value is missing', () => {
    renderRenewalPeriod();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
