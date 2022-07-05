import { renderHook } from '@testing-library/react-hooks';
import { useIntl } from 'react-intl';

import { createExportReport } from './createExportReport';
import {
  orderLine,
  order,
  vendor,
  user,
  acqUnit,
  materialType,
  location,
  contributorNameType,
  identifierType,
  expenseClass,
  address,
  exportReport,
} from '../../../../test/jest/fixtures';

test('createExportReport should return export report object', () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  expect(createExportReport(
    intl,
    [orderLine],
    [order],
    [vendor],
    [user],
    [acqUnit],
    [materialType],
    [location],
    [],
    [contributorNameType],
    [identifierType],
    [expenseClass],
    [address],
    [{ id: orderLine.acquisitionMethod, value: 'Purchase' }],
    [{ id: vendor?.organizationTypes?.[0], name: 'Test type' }],
  )).toEqual(exportReport);
});
