import { useIntl } from 'react-intl';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

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

describe('createExportReport', () => {
  it('should return export report object', () => {
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
    )).toEqual(expect.objectContaining(exportReport));
  });

  it('should build rows with orders data even if there are no PO Lines in the order', () => {
    const { result } = renderHook(() => useIntl());
    const intl = result.current;

    const [exportRow] = createExportReport(
      intl,
      undefined,
      [order],
    );

    expect(exportRow.poNumber).toEqual(order.poNumber);
    expect(exportRow.orderType).toEqual(order.orderType);
    expect(exportRow.workflowStatus).toEqual(order.workflowStatus);
    expect(exportRow.note).toEqual(order.notes.join('|'));
  });
});
