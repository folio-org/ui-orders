import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { TextField } from '@folio/stripes/components';

import { orderLine } from 'fixtures';
import PackagePoLineField from './PackagePoLineField';

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
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <PackagePoLineField
        {...defaultProps}
        {...props}
      />
    )}
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
