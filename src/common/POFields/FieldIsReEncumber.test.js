import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldIsReEncumber from './FieldIsReEncumber';

const renderFieldIsReEncumber = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldIsReEncumber
        {...props}
      />
    )}
  />,
);

describe('FieldIsReEncumber', () => {
  it('should render \'is re-encumber\' field', () => {
    renderFieldIsReEncumber();

    expect(screen.getByText('ui-orders.orderDetails.reEncumber')).toBeInTheDocument();
  });
});
