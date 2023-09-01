import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldExpectedActivation from './FieldExpectedActivation';

const renderFieldExpectedActivation = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldExpectedActivation
        {...props}
      />
    )}
  />,
);

describe('FieldExpectedActivation', () => {
  it('should render \'expected activation\' field', () => {
    renderFieldExpectedActivation();

    expect(screen.getByText('ui-orders.eresource.expectedActivation')).toBeInTheDocument();
  });
});
