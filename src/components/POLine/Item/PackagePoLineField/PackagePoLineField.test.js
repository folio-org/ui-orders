import React from 'react';
import { render, screen } from '@testing-library/react';

import { TextField } from '@folio/stripes/components';

import PackagePoLineField from './PackagePoLineField';
import { orderLine } from '../../../../../test/jest/fixtures';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  TextField: jest.fn().mockReturnValue('TextField'),
}));

const defaultProps = {
  resources: {
    linkedPoLine: {
      records: [orderLine],
    },
  },
  poLineId: orderLine.id,
  disabled: false,
  onSelectLine: jest.fn(),
};

const renderPackagePoLineField = (props = {}) => render(
  <PackagePoLineField
    {...defaultProps}
    {...props}
  />,
);

describe('PackagePoLineField', () => {
  it('should render field', () => {
    renderPackagePoLineField();

    expect(screen.getByText(/TextField/i)).toBeInTheDocument();
  });

  it('should call onSelectLine when field was clear', () => {
    renderPackagePoLineField();

    TextField.mock.calls[0][0].onClearField();

    expect(defaultProps.onSelectLine).toHaveBeenCalled();
  });
});
