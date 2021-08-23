import React from 'react';
import { render, screen } from '@testing-library/react';

import { PrintOrder } from './PrintOrder';
import { order, orderLine } from '../../test/jest/fixtures';

jest.mock('./ComponentToPrint', () => jest.fn().mockReturnValue('ComponentToPrint'));
jest.mock('../common/ExportSettingsModal/utils/getExportData', () => ({
  getExportData: jest.fn(),
}));

const defaultProps = {
  order: {
    ...order,
    compositePoLines: [orderLine],
  },
  onCancel: jest.fn(),
  mutator: {},
};

const renderPrintOrder = (props = {}) => render(
  <PrintOrder
    {...defaultProps}
    {...props}
  />,
);

describe('PrintOrder', () => {
  it('should get and render data', async () => {
    renderPrintOrder();

    const component = await screen.findByText('ComponentToPrint');

    expect(component).toBeInTheDocument();
  });
});
