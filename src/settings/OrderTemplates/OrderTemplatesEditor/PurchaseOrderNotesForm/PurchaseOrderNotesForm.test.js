import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import PurchaseOrderNotesForm from './PurchaseOrderNotesForm';

jest.mock('../../../../common/POFields/FieldsNotes', () => jest.fn().mockReturnValue('FieldsNotes'));

const renderPurchaseOrderNotesForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <PurchaseOrderNotesForm
        {...props}
      />
    )}
  />,
);

describe('PurchaseOrderNotesForm', () => {
  it('should render \'PO notes form\'', () => {
    renderPurchaseOrderNotesForm();

    expect(screen.getByText('FieldsNotes')).toBeInTheDocument();
  });
});
