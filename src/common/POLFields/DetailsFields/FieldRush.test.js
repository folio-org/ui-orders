import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldRush from './FieldRush';

const renderFieldRush = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRush
        {...props}
      />
    )}
  />,
);

describe('FieldRush', () => {
  it('should render \'rush\' field', () => {
    renderFieldRush();

    expect(screen.getByText('ui-orders.poLine.rush')).toBeInTheDocument();
  });
});
