import React from 'react';
import { render, screen } from '@testing-library/react';

import FieldBillToView from './FieldBillToView';
import { address } from '../../../test/jest/fixtures';

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
