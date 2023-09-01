import { Form } from 'react-final-form';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { vendor } from 'fixtures';
import FieldOrderFormat from './FieldOrderFormat';

const defaultProps = {
  formValues: {
    isPackage: true,
    locations: [{}],
  },
  vendor,
  createInventorySetting: {},
  disabled: false,
};

const renderFieldOrderFormat = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldOrderFormat
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldOrderFormat', () => {
  it('should render \'order format\' field', () => {
    renderFieldOrderFormat();

    expect(screen.getByText('ui-orders.poLine.orderFormat')).toBeInTheDocument();
  });

  it('should change field value when an option was selected', async () => {
    renderFieldOrderFormat();

    const options = screen.getAllByRole('option');
    const select = await screen.findByRole('combobox');

    await user.selectOptions(select, 'Other');

    expect(options[4].selected).toBeTruthy();

    await user.selectOptions(select, 'Electronic Resource');

    expect(options[1].selected).toBeTruthy();
  });
});
