import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldSuffix from './FieldSuffix';

const defaultProps = {
  suffixes: [],
};

const renderFieldSuffix = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldSuffix
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldSuffix', () => {
  it('should render \'suffix\' field', () => {
    renderFieldSuffix();

    expect(screen.getByText('ui-orders.orderDetails.orderNumberSuffix')).toBeInTheDocument();
  });
});
