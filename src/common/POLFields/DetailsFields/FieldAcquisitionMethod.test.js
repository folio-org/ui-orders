import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldAcquisitionMethod from './FieldAcquisitionMethod';

const renderFieldAcquisitionMethod = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldAcquisitionMethod
        {...props}
      />
    )}
  />,
);

describe('FieldAcquisitionMethod', () => {
  it('should render \'acquisition method\' field', () => {
    renderFieldAcquisitionMethod({ acquisitionMethods: [] });

    expect(screen.getByText('ui-orders.poLine.acquisitionMethod')).toBeInTheDocument();
  });
});
