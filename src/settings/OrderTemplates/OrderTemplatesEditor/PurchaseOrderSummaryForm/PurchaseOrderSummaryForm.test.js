import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import PurchaseOrderSummaryForm from './PurchaseOrderSummaryForm';

const renderPurchaseOrderSummaryForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <PurchaseOrderSummaryForm
        {...props}
      />
    )}
  />,
);

describe('PurchaseOrderSummaryForm', () => {
  it('should render \'PO summary form\'', () => {
    renderPurchaseOrderSummaryForm();

    expect(screen.getByText('ui-orders.orderSummary.approved')).toBeInTheDocument();
  });
});
