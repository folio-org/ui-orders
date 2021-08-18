import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldOngoingInfoNotes from './FieldOngoingInfoNotes';

const renderFieldOngoingInfoNotes = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldOngoingInfoNotes
        {...props}
      />
    )}
  />,
);

describe('FieldOngoingInfoNotes', () => {
  it('should render notes field', async () => {
    renderFieldOngoingInfoNotes();

    expect(screen.getByText('ui-orders.renewals.notes')).toBeInTheDocument();
  });
});
