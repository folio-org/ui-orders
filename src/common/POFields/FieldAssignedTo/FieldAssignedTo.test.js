import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldAssignedTo from './FieldAssignedTo';
import { user as mockUser } from '../../../../test/jest/fixtures';

const defaultProps = {
  change: jest.fn(),
  userId: '296e8d0e-c43b-5fd3-85d4-3ae5dd1676b7',
  mutator: {
    users: {
      GET: jest.fn().mockResolvedValue([mockUser]),
    },
  },
};

const renderFieldAssignedTo = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldAssignedTo
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldAssignedTo', () => {
  it('should return Assigned To field', async () => {
    renderFieldAssignedTo();

    const field = await screen.findByLabelText('ui-orders.orderDetails.assignedTo');

    expect(field).toBeInTheDocument();
  });
});
