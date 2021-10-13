import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reduxForm } from 'redux-form';
import { render, screen } from '@testing-library/react';

import { InstanceMatchingForm } from './InstanceMatchingForm';

const store = createStore(jest.fn());

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

const TestComponent = reduxForm({
  form: 'testform',
})((props = {}) => (
  <form
    onSubmit={() => jest.fn()}
  >
    <InstanceMatchingForm
      {...props}
    />
  </form>
));

const renderInstanceMatchingForm = (props = {}) => render(
  <TestComponent
    {...props}
  />,
  { wrapper },
);

describe('InstanceMatchingForm', () => {
  it('should render \'instance matching\' description and checkbox', () => {
    renderInstanceMatchingForm();

    expect(screen.getByText('ui-orders.settings.instanceMatching.description')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.instanceMatching.toggle')).toBeInTheDocument();
  });
});
