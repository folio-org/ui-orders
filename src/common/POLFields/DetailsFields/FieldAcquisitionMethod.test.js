import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldAcquisitionMethod from './FieldAcquisitionMethod';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderFieldAcquisitionMethod = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldAcquisitionMethod
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('FieldAcquisitionMethod', () => {
  it('should render \'acquisition method\' field', () => {
    renderFieldAcquisitionMethod({ acquisitionMethods: [] });

    expect(screen.getByText('ui-orders.poLine.acquisitionMethod')).toBeInTheDocument();
  });
});
