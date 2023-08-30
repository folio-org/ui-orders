import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldCheckInItems from './FieldCheckInItems';

const renderFieldCheckInItems = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldCheckInItems
        {...props}
      />
    )}
  />,
);

describe('FieldCheckInItems', () => {
  it('should render \'check-in items\' field', () => {
    renderFieldCheckInItems();

    expect(screen.getByText('ui-orders.poLine.receivingWorkflow')).toBeInTheDocument();
  });
});
