import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { FieldClaimingActive } from './FieldClaimingActive';

const renderFieldClaimingActive = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldClaimingActive
        {...props}
      />
    )}
  />,
);

describe('FieldClaimingActive', () => {
  it('should render \'Claiming active\' field', () => {
    renderFieldClaimingActive();

    expect(screen.getByText('ui-orders.poLine.claimingActive')).toBeInTheDocument();
  });
});
