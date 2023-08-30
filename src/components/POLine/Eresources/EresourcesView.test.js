import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { order } from 'fixtures';
import EresourcesView from './EresourcesView';

const defaultProps = {
  materialTypes: [{
    id: 'materialTypeId',
  }],
  line: {
    eresource: {
      expectedActivation: '',
      activationDue: 5,
      accessProvider: '',
      materialType: 'materialTypeId',
      resourceUrl: 'resourceUrl',
    },
  },
  order,
};

const renderEresourcesView = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <EresourcesView
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('EresourcesView', () => {
  it('should render \'eresources\' view', () => {
    renderEresourcesView();

    expect(screen.getByText('ui-orders.eresource.accessProvider')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.activationStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.activationDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.trial')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.expectedActivation')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.userLimit')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.url')).toBeInTheDocument();
  });
});
