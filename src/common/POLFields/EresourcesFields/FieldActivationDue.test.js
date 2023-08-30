import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldActivationDue from './FieldActivationDue';

const renderFieldActivationDue = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldActivationDue
        {...props}
      />
    )}
  />,
);

describe('FieldActivationDue', () => {
  it('should render \'activation due\' field', () => {
    renderFieldActivationDue();

    expect(screen.getByText('ui-orders.eresource.activationDue')).toBeInTheDocument();
  });
});
