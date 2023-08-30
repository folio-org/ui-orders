import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldActivated from './FieldActivated';

const renderFieldActivated = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldActivated
        {...props}
      />
    )}
  />,
);

describe('FieldActivated', () => {
  it('should render \'activation status\' field', () => {
    renderFieldActivated();

    expect(screen.getByText('ui-orders.eresource.activationStatus')).toBeInTheDocument();
  });
});
