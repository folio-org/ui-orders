import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { address } from 'fixtures';
import FieldBillToView from './FieldBillToView';

const renderFieldBillToView = (props = {}) => render(
  <FieldBillToView
    {...props}
  />,
);

describe('FieldBillToView', () => {
  it('should render \'bill to\' value', () => {
    renderFieldBillToView({ value: address.id });

    expect(screen.getByText(address.id)).toBeInTheDocument();
  });

  it('should render a hyphen if a value is missing', () => {
    renderFieldBillToView();

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
