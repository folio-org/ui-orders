import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import SummaryForm from './SummaryForm';

const defaultProps = {
  initialValues: {},
  order: {
    workflowStatus: 'Pending',
    totalEstimatedPrice: '42',
    totalItems: 1,
  },
};

const renderSummaryForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <SummaryForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('SummaryForm', () => {
  it('should render \'summary form\' fields', () => {
    renderSummaryForm();

    expect(screen.getByText('ui-orders.orderSummary.totalUnits')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.totalEstimatedPrice')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.approved')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.workflowStatus')).toBeInTheDocument();
  });
});
