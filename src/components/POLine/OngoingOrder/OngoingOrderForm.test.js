import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import OngoingOrderForm from './OngoingOrderForm';

const defaultProps = {
  formValues: {},
  initialValues: {},
  change: jest.fn(),
};

const renderOngoingOrderForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <OngoingOrderForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('OngoingOrderForm', () => {
  it('should render \'OngoingOrderForm\' field', () => {
    renderOngoingOrderForm();

    expect(screen.getByText('ui-orders.poLine.renewalNote')).toBeInTheDocument();
  });
});
