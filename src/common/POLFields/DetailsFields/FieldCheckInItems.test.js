import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldCheckInItems from './FieldCheckInItems';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useForm: jest.fn().mockReturnValue({
    change: jest.fn(),
  }),
}));

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
