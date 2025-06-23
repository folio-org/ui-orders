import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useFiscalYear } from '@folio/stripes-acq-components';

import { FiscalYearOpenedView } from './FiscalYearOpenedView';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => <div>Loading...</div>,
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFiscalYear: jest.fn(),
}));

const renderComponent = (props = {}) => render(
  <FiscalYearOpenedView
    fiscalYearId="test-id"
    {...props}
  />,
);

describe('FiscalYearOpenedView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading indicator when fiscal year data is loading', () => {
    useFiscalYear.mockReturnValue({
      fiscalYear: null,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display formatted fiscal year when data is loaded', () => {
    const mockFiscalYear = {
      id: 'fy-id',
      name: 'FY 2025',
      code: 'FY2025',
    };

    useFiscalYear.mockReturnValue({
      fiscalYear: mockFiscalYear,
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByText(`${mockFiscalYear.name} (${mockFiscalYear.code})`)).toBeInTheDocument();
  });
});
