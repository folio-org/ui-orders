import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldCancellationRestrictionNote from './FieldCancellationRestrictionNote';

const renderFieldCancellationRestrictionNote = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldCancellationRestrictionNote
        {...props}
      />
    )}
  />,
);

describe('FieldCancellationRestrictionNote', () => {
  it('should render \'cancellation restriction note\' field', () => {
    renderFieldCancellationRestrictionNote();

    expect(screen.getByText('ui-orders.poLine.cancellationRestrictionNote')).toBeInTheDocument();
  });
});
