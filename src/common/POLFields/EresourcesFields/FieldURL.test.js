import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldURL from './FieldURL';

const renderFieldURL = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldURL
        {...props}
      />
    )}
  />,
);

describe('FieldURL', () => {
  it('should render \'URL\' field', () => {
    renderFieldURL();

    expect(screen.getByText('ui-orders.eresource.url')).toBeInTheDocument();
  });
});
