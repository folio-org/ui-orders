import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { order, orderLine } from 'fixtures';
import { PrintOrder } from './PrintOrder';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(() => ({})),
  useStripes: jest.fn(() => ({
    currency: 'USD',
  })),
  stripesConnect: jest.fn(component => component),
}));
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
