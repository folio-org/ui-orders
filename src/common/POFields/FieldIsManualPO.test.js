import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldIsManualPO from './FieldIsManualPO';

const renderFieldIsManualPO = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldIsManualPO
        {...props}
      />
    )}
  />,
);

describe('FieldIsManualPO', () => {
  it('should render \'is manual\' field', () => {
    renderFieldIsManualPO();

    expect(screen.getByText('ui-orders.orderDetails.manualPO')).toBeInTheDocument();
  });
});
