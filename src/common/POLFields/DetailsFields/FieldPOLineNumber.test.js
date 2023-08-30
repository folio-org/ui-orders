import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldPOLineNumber from './FieldPOLineNumber';

const renderFieldPOLineNumber = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldPOLineNumber
        {...props}
      />
    )}
  />,
);

describe('FieldPOLineNumber', () => {
  it('should render \'PO line number\' field', () => {
    renderFieldPOLineNumber();

    expect(screen.getByText('ui-orders.poLine.number')).toBeInTheDocument();
  });
});
