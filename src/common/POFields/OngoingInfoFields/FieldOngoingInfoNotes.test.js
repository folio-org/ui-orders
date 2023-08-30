import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
