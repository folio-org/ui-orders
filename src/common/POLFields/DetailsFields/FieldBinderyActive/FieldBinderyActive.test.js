import { Form } from 'react-final-form';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { FieldBinderyActive } from './FieldBinderyActive';

const defaultProps = {
  onChange: jest.fn(),
};

const renderFieldBinderyActive = (props = {}) => render(
  <Form
    onSubmit={jest.fn()}
    render={() => (
      <FieldBinderyActive
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldBinderyActive', () => {
  it('should render \'bindery active\' field', () => {
    renderFieldBinderyActive();

    expect(screen.getByText('ui-orders.poLine.isBinderyActive')).toBeInTheDocument();
  });
});
