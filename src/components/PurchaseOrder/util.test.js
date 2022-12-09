import { getPoFieldsLabelMap } from './util';

describe('getPoFieldsLabelMap', () => {
  it('should return labels\' map of PO fields', () => {
    expect(getPoFieldsLabelMap()).toEqual(
      expect.objectContaining({
        'vendor': 'ui-orders.orderDetails.vendor',
        'ongoing.isSubscription': 'ui-orders.renewals.subscription',
        'workflowStatus': 'ui-orders.orderSummary.workflowStatus',
      }),
    );
  });
});
