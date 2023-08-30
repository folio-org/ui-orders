import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldAutomaticExport from './FieldAutomaticExport';

const renderFieldAutomaticExport = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldAutomaticExport
        {...props}
      />
    )}
  />,
);

describe('FieldAutomaticExport', () => {
  it('should render \'Automatic export\' field', () => {
    renderFieldAutomaticExport();

    expect(screen.getByText('ui-orders.poLine.automaticExport')).toBeInTheDocument();
  });
});
