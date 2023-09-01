import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldTrial from './FieldTrial';

const renderFieldTrial = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldTrial
        {...props}
      />
    )}
  />,
);

describe('FieldTrial', () => {
  it('should render \'trial\' field', () => {
    renderFieldTrial();

    expect(screen.getByText('ui-orders.eresource.trial')).toBeInTheDocument();
  });
});
