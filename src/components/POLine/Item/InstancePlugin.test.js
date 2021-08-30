import React from 'react';
import { render, screen } from '@testing-library/react';

import InstancePlugin from './InstancePlugin';

const defaultProps = {
  addInstance: jest.fn(),
};

const renderInstancePlugin = (props = {}) => render(
  <InstancePlugin
    {...defaultProps}
    {...props}
  />,
);

describe('InstancePlugin', () => {
  it('should render component', () => {
    renderInstancePlugin();

    expect(screen.getByText('ui-orders.itemDetails.titleLookUpNoPlugin')).toBeInTheDocument();
  });
});
