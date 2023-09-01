import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { MemoryRouter } from 'react-router';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldsLocation from './FieldsLocation';

jest.mock('react-final-form-arrays', () => ({
  FieldArray: jest.fn().mockReturnValue('Location field'),
}));

const defaultProps = {
  changeLocation: jest.fn(),
  locationIds: ['fcd64ce1-6995-48f0-840e-89ffa2288371'],
};

const renderFieldsLocation = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldsLocation
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
);

describe('FieldsLocation', () => {
  it('should render \'location\' field', () => {
    renderFieldsLocation();

    FieldArray.mock.calls[0][0].renderField();

    expect(screen.getByText('Location field')).toBeInTheDocument();
  });

  it('should return null if locations are missing', () => {
    renderFieldsLocation({ locations: null });

    expect(screen.queryByText('Location field')).not.toBeInTheDocument();
  });

  it('should render \'quantity popover\' if quantity disabled', async () => {
    renderFieldsLocation({ isQuantityDisabled: true });

    expect(screen.queryByText('ui-orders.cost.quantityPopover')).toBeInTheDocument();
  });
});
