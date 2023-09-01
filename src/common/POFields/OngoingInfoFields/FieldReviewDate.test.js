import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
