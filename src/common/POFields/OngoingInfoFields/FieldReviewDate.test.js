import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldReviewDate from './FieldReviewDate';

const renderFieldReviewDate = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldReviewDate
        {...props}
      />
    )}
  />,
);

describe('FieldReviewDate', () => {
  it('should render review date field', async () => {
    renderFieldReviewDate();

    expect(screen.getByText('ui-orders.renewals.reviewDate')).toBeInTheDocument();
  });
});
