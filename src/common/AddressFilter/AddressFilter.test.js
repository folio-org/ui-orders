import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import AddressFilter from './AddressFilter';

const options = [
  {
    value: 'opt-1',
    label: 'Option 1',
  },
  {
    value: 'opt-2',
    label: 'Option 2',
  },
  {
    value: 'opt-3',
    label: 'Option 3',
  },
];

const defaultProps = {
  id: 'test-address-filter-id',
  name: 'test-address-filter-name',
  labelId: 'test-address-filter-labelid',
  onChange: jest.fn(() => {}),
};

const emptyListMessage = /--/i;

describe('AddressFilter', () => {
  it('should return an empty item when no options are passed', async () => {
    render(<AddressFilter {...defaultProps} />);

    await user.click(screen.getByText('stripes-components.selection.controlLabel'));
    expect(screen.getByText(emptyListMessage)).toBeInTheDocument();
  });

  it('should return list of options', () => {
    render(<AddressFilter {...defaultProps} addresses={options} />);

    expect(screen.queryByText(emptyListMessage)).not.toBeInTheDocument();
  });
});
