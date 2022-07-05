import { renderHook } from '@testing-library/react-hooks';
import { useIntl } from 'react-intl';

import { getExportData } from './getExportData';
import {
  address,
  orderLine,
  order,
  vendor,
} from '../../../../test/jest/fixtures';

jest.mock('./createExportReport', () => ({
  createExportReport: jest.fn().mockReturnValue('test report'),
}));

const mockMutator = {
  acquisitionMethods: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportVendors: {
    GET: jest.fn().mockReturnValue([vendor]),
    reset: jest.fn(),
  },
  exportUsers: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportAcqUnits: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportMaterialTypes: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportLocations: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportContributorNameTypes: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportIdentifierTypes: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportExpenseClasses: {
    GET: jest.fn(),
    reset: jest.fn(),
  },
  exportAddresses: {
    GET: jest.fn().mockResolvedValue([address]),
    reset: jest.fn(),
  },
  organizationTypes: {
    GET: jest.fn().mockResolvedValue([]),
    reset: jest.fn(),
  },
};

test('should ', async () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  const report = await getExportData(mockMutator, [orderLine], [order], intl);

  expect(report).toEqual('test report');
});
