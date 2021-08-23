import React from 'react';
import { render, screen } from '@testing-library/react';

import ReviewDate from './ReviewDate';

const renderReviewDate = (props = {}) => render(
  <ReviewDate
    {...props}
  />,
);

describe('ReviewDate', () => {
  it('should render review date', () => {
    renderReviewDate({ value: '2012-12-21T00:00:00.000+00:00' });

    expect(screen.getByText('2012-12-21')).toBeInTheDocument();
  });

  it('should render a hyphen if a value is missing', () => {
    renderReviewDate();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
