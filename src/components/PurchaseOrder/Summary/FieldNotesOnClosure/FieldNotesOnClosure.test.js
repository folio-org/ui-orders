import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import { FieldNotesOnClosure } from './FieldNotesOnClosure';

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const defaultProps = {};

const renderField = (props = {}) => render(
  <Form onSubmit={jest.fn()}>
    <FieldNotesOnClosure
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

describe('FieldNotesOnClosure', () => {
  it('should render \'Notes on closure\' field', () => {
    renderField();

    expect(screen.getByText('ui-orders.orderSummary.closingNote')).toBeInTheDocument();
  });
});
