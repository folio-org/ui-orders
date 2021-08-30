import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldOrderFormat from './FieldOrderFormat';

import { vendor } from '../../../../test/jest/fixtures';

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

    user.selectOptions(select, 'Other');

    expect(options[4].selected).toBeTruthy();

    user.selectOptions(select, 'Electronic Resource');

    expect(options[1].selected).toBeTruthy();
  });
});
