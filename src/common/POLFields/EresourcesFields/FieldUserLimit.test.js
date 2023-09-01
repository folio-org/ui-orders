import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldUserLimit from './FieldUserLimit';

const renderFieldUserLimit = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldUserLimit
        {...props}
      />
    )}
  />,
);

describe('FieldUserLimit', () => {
  it('should render \'user limit\' field', () => {
    renderFieldUserLimit();

    expect(screen.getByText('ui-orders.eresource.userLimit')).toBeInTheDocument();
  });
});
