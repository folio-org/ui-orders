import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
