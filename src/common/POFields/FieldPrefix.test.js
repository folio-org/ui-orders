import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldPrefix from './FieldPrefix';

const defaultProps = {
  prefixes: [],
};

const renderFieldPrefix = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldPrefix
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldPrefix', () => {
  it('should render \'prefix\' field', () => {
    renderFieldPrefix();

    expect(screen.getByText('ui-orders.orderDetails.orderNumberPrefix')).toBeInTheDocument();
  });
});
