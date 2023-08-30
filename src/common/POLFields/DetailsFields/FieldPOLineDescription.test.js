import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldPOLineDescription from './FieldPOLineDescription';

const renderFieldPOLineDescription = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldPOLineDescription
        {...props}
      />
    )}
  />,
);

describe('FieldPOLineDescription', () => {
  it('should render \'PO line description\' field', () => {
    renderFieldPOLineDescription();

    expect(screen.getByText('ui-orders.poLine.poLineDescription')).toBeInTheDocument();
  });
});
