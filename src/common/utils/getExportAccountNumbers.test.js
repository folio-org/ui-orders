import { getExportAccountNumbers } from './getExportAccountNumbers';

const vendorAccount = '12345';

it('should return an array of vendor account numbers', () => {
  const accountNumbers = getExportAccountNumbers([{ automaticExport: true, vendorDetail: { vendorAccount } }]);

  expect(accountNumbers).toEqual([vendorAccount]);
});
