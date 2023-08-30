import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldAccessProvider from './FieldAccessProvider';

const renderFieldAccessProvider = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldAccessProvider
        {...props}
      />
    )}
  />,
);

describe('FieldAccessProvider', () => {
  it('should render \'access provider\' field', () => {
    renderFieldAccessProvider();

    expect(screen.getByText('ui-orders.eresource.accessProvider')).toBeInTheDocument();
  });
});
