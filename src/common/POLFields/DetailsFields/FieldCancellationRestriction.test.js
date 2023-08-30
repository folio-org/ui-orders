import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldCancellationRestriction from './FieldCancellationRestriction';

const renderFieldCancellationRestriction = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldCancellationRestriction
        {...props}
      />
    )}
  />,
);

describe('FieldCancellationRestriction', () => {
  it('should render \'cancellation restriction\' field', () => {
    renderFieldCancellationRestriction();

    expect(screen.getByText('ui-orders.poLine.cancellationRestriction')).toBeInTheDocument();
  });
});
