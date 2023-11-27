import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { FieldClaimingInterval } from './FieldClaimingInterval';

const renderFieldClaimingInterval = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldClaimingInterval
        {...props}
      />
    )}
  />,
);

describe('FieldClaimingInterval', () => {
  it('should render \'Claiming interval\' field', () => {
    renderFieldClaimingInterval();

    expect(screen.getByText('ui-orders.poLine.claimingInterval')).toBeInTheDocument();
  });
});
