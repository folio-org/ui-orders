import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { InstanceMatchingForm } from './InstanceMatchingForm';

const renderInstanceMatchingForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <InstanceMatchingForm
        {...props}
      />
    )}
  />,
);

describe('InstanceMatchingForm', () => {
  it('should render \'instance matching\' description and checkbox', () => {
    renderInstanceMatchingForm();

    expect(screen.getByText('ui-orders.settings.instanceMatching.description')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.instanceMatching.toggle')).toBeInTheDocument();
  });
});
