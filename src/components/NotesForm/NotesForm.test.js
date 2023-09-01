import { Form } from 'react-final-form';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import NotesForm from './NotesForm';

const defaultProps = {
  fields: {
    push: jest.fn(),
    map: Array.prototype.map.bind(['field']),
    remove: jest.fn(),
  },
};

const renderNotesForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <NotesForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('NotesForm', () => {
  it('should render \'notes\' form', () => {
    renderNotesForm();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should add a note', async () => {
    renderNotesForm();

    await user.click(screen.getByText('ui-orders.orderDetails.addNoteBtn'));

    expect(defaultProps.fields.push).toHaveBeenCalled();
  });

  it('should remove a note', async () => {
    renderNotesForm();

    await user.click(screen.getByText(/icon/i));

    expect(defaultProps.fields.remove).toHaveBeenCalled();
  });
});
