import { contributorNameType } from './contributorNameType';

export const orderLine = {
  id: 'baec48dd-1594-2712-be8f-de336bc83fcc',
  edition: 'First edition',
  checkinItems: false,
  agreementId: '800b2f19-7134-4408-8145-3b04697b7de7',
  acquisitionMethod: 'Purchase',
  cancellationRestriction: false,
  cancellationRestrictionNote: '',
  claims: [
    {
      claimed: true,
      grace: 0,
    },
  ],
  collection: false,
  contributors: [{
    contributor: 'contributor',
    contributorNameTypeId: contributorNameType.id,
  }],
  cost: {
    listUnitPrice: 500,
    listUnitPriceElectronic: 0,
    currency: 'USD',
    additionalCost: 0,
    discount: 20,
    discountType: 'amount',
    exchangeRate: 22,
    quantityPhysical: 6,
    quantityElectronic: 1,
    poLineEstimatedPrice: 2980,
  },
  description: '',
  details: {
    receivingNote: '',
    productIds: [
      {
        productId: '0552142352',
        productIdType: '8261054f-be78-422d-bd51-4ed9f33c3422',
      },
      {
        productId: '9780552142352',
        productIdType: '8261054f-be78-422d-bd51-4ed9f33c3422',
      },
    ],
    subscriptionFrom: '2018-07-20T00:00:00.000+00:00',
    subscriptionInterval: 1095,
    subscriptionTo: '2021-07-19T00:00:00.000+00:00',
  },
  donor: '',
  eresource: {
    activated: false,
    createInventory: 'Instance, Holding',
    trial: true,
    expectedActivation: '2019-07-20T00:00:00.000+00:00',
    userLimit: 0,
    accessProvider: '14fb6608-cdf1-11e8-a8d5-f2801f1b9fd1',
    materialType: 'a7eb0130-7287-4485-b32c-b4b5814da0fa',
  },
  fundDistribution: [
    {
      code: 'USHIST',
      encumbrance: 'e1a607b4-2ed3-4bd9-9c1e-3726737d5425',
      fundId: '65032151-39a5-4cef-8810-5350eb316300',
      distributionType: 'percentage',
      value: 50,
      expenseClassId: 'test-expense-class-id',
    },
  ],
  isPackage: true,
  locations: [
    {
      locationId: 'f34d27c6-a8eb-461b-acd6-5dea81771e70',
      quantity: 2,
      quantityElectronic: 1,
      quantityPhysical: 1,
    },
  ],
  orderFormat: 'P/E Mix',
  paymentStatus: 'Pending',
  physical: {
    createInventory: 'Instance, Holding, Item',
    materialType: '5ee11d91-f7e8-481d-b079-65d708582ccc',
    materialSupplier: '70fb4e66-cdf1-11e8-a8d5-f2801f1b9fd1',
    receiptDue: '2018-08-19T00:00:00.000+00:00',
    volumes: [
      'vol. 1',
    ],
  },
  poLineDescription: '',
  poLineNumber: '52590-1',
  purchaseOrderId: '0610be6d-0ddd-494b-b867-19f63d8b5d6d',
  receiptStatus: 'Pending',
  requester: '',
  rush: false,
  selector: 'sgw',
  source: 'User',
  tags: {
    tagList: [
      'membership',
    ],
  },
  titleOrPackage: 'Interesting Times',
  vendorDetail: {
    instructions: '',
    noteFromVendor: '',
    vendorAccount: '',
    referenceNumbers: [{
      refNumber: 'refNumber',
      refNumberType: 'refNumberType',
    }],
  },
  metadata: {
    createdDate: '2021-08-15T01:52:09.051+00:00',
    updatedDate: '2021-08-15T01:52:09.051+00:00',
  },
};
