import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
