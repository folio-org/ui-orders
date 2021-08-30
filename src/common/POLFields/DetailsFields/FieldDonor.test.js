import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldDonor from './FieldDonor';

const renderFieldDonor = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldDonor
        {...props}
      />
    )}
  />,
);

describe('FieldDonor', () => {
  it('should render \'donor\' field', () => {
    renderFieldDonor();

    expect(screen.getByText('ui-orders.poLine.donor')).toBeInTheDocument();
  });
});
