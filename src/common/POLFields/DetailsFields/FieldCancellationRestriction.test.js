import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldCancellationRestriction from './FieldCancellationRestriction';

const renderFieldCancellationRestriction = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldCancellationRestriction
        {...props}
      />
    )}
  />,
);

describe('FieldCancellationRestriction', () => {
  it('should render \'cancellation restriction\' field', () => {
    renderFieldCancellationRestriction();

    expect(screen.getByText('ui-orders.poLine.cancellationRestriction')).toBeInTheDocument();
  });
});
