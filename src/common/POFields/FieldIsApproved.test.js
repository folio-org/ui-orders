import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldIsApproved from './FieldIsApproved';

const renderFieldIsApproved = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldIsApproved
        {...props}
      />
    )}
  />,
);

describe('FieldIsApproved', () => {
  it('should render \'is approved\' field', () => {
    renderFieldIsApproved();

    expect(screen.getByText('ui-orders.orderSummary.approved')).toBeInTheDocument();
  });
});
