import { Form, useFormState } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import OngoingInfoForm from './OngoingInfoForm';

jest.mock('react-final-form', () => ({
  ...jest.requireActual('react-final-form'),
  useFormState: jest.fn().mockReturnValue({
    values: {
      workflowStatus: 'Pending',
      orderType: 'Ongoing',
    },
  }),
}));

const renderOngoingInfoForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <OngoingInfoForm
        {...props}
      />
    )}
  />,
);

describe('OngoingInfoForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render \'ongoing info form\' fields', () => {
    renderOngoingInfoForm();

    expect(screen.getByText('ui-orders.renewals.subscription')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.renewalInterval')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.renewalDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.reviewPeriod')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.manualRenewal')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.reviewDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.notes')).toBeInTheDocument();
  });

  it('should renewalDate fields to be editable when workFlowStatus is Open', () => {
    useFormState.mockReturnValue({
      values: {
        workflowStatus: 'Open',
        orderType: 'Ongoing',
      },
    });

    renderOngoingInfoForm();

    expect(screen.getByText('ui-orders.renewals.renewalDate')).toBeEnabled();
  });

  it('should disable "Subscription" checkbox when order workFlow status is Open', () => {
    useFormState.mockReturnValue({
      values: {
        workflowStatus: 'Open',
        orderType: 'Ongoing',
      },
    });

    renderOngoingInfoForm();

    expect(screen.getByRole('checkbox', { name: /ui-orders.renewals.subscription/ })).toBeDisabled();
  });
});
