import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldCollection from './FieldCollection';

const renderFieldCollection = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldCollection
        {...props}
      />
    )}
  />,
);

describe('FieldCollection', () => {
  it('should render \'collections\' field', () => {
    renderFieldCollection();

    expect(screen.getByText('ui-orders.poLine.сollection')).toBeInTheDocument();
  });
});
