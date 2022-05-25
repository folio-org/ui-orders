import '@folio/stripes-acq-components/test/jest/__mock__';

import { instance } from '../../../../test/jest/fixtures';

import { PRODUCT_ID_TYPE } from '../../../common/constants';

import {
  createPOLDataFromInstance,
  getInventoryData,
  shouldSetInstanceId,
} from './util';

const formValues = {
  contributors: [{
    contributor: 'c1',
    contributorNameTypeId: 'ct1',
  }],
  details: {
    productIds: [
      {
        productId: '410 254-2',
        productIdType: 'b5d8cdc4-9441-487c-90cf-0c7ec97728eb',
      },
      {
        productId: 'London',
        productIdType: 'b5d8cdc4-9441-487c-90cf-0c7ec97728eb',
      },
    ],
  },
  isPackage: false,
  titleOrPackage: 'some title',
};
const inventoryData = getInventoryData({ ...formValues, instanceId: 'someId' });

describe('shouldSetInstanceId', () => {
  it('should return false if checkbox isPackage is checked', () => {
    const isPackageFormValues = {
      ...formValues,
      isPackage: true,
    };

    expect(shouldSetInstanceId(isPackageFormValues, inventoryData)).toBeFalsy();
  });

  it('should return true if form data contains inventory data', () => {
    expect(shouldSetInstanceId({ ...formValues, instanceId: 'someId' }, inventoryData)).toBeTruthy();
  });

  it('should return true if form data contains inventory data and it lost instanceId link', () => {
    expect(shouldSetInstanceId(formValues, inventoryData)).toBeTruthy();
  });

  it('should return false if title was changed', () => {
    expect(shouldSetInstanceId({ ...formValues, titleOrPackage: 'new' }, inventoryData)).toBeFalsy();
  });

  it('should return false if publisher was changed', () => {
    expect(shouldSetInstanceId({ ...formValues, publisher: 'new' }, inventoryData)).toBeFalsy();
  });

  it('should return false if publicationDate was changed', () => {
    expect(shouldSetInstanceId({ ...formValues, publicationDate: 'new' }, inventoryData)).toBeFalsy();
  });

  it('should return false if edition was changed', () => {
    expect(shouldSetInstanceId({ ...formValues, edition: 'new' }, inventoryData)).toBeFalsy();
  });

  it('should return false if contributors were changed', () => {
    const newContributorsFormValues = {
      ...formValues,
      contributors: [{
        contributor: formValues.contributors[0].contributor,
        contributorNameTypeId: 'new contr typw',
      }],
    };

    expect(shouldSetInstanceId(newContributorsFormValues, inventoryData)).toBeFalsy();
  });

  it('should return false if productIds were changed', () => {
    const newProductIdsFormValues = {
      ...formValues,
      details: {
        productIds: [{
          productId: 'new id',
          productIdType: formValues.details.productIds[0].productIdType,
        }],
      },
    };

    expect(shouldSetInstanceId(newProductIdsFormValues, inventoryData)).toBeFalsy();
  });

  it('should return true if productIds were deleted', () => {
    const newProductIdsFormValues = {
      ...formValues,
      details: {
        productIds: [formValues.details.productIds[0]],
      },
    };

    expect(shouldSetInstanceId(newProductIdsFormValues, inventoryData)).toBeTruthy();
  });

  it('should return false if productIds were added', () => {
    const newProductIdsFormValues = {
      ...formValues,
      details: {
        productIds: [
          ...formValues.details.productIds,
          {
            productId: 'new',
            productIdType: 'new',
          },
        ],
      },
    };

    expect(shouldSetInstanceId(newProductIdsFormValues, inventoryData)).toBeFalsy();
  });
});

describe('createPOLDataFromInstance', () => {
  it('should return POL data from instance', () => {
    expect(createPOLDataFromInstance(instance, [{ label: PRODUCT_ID_TYPE.isbn, value: 'isbn' }])).toEqual({
      instanceId: instance.id,
      titleOrPackage: instance.title,
      publisher: instance.publication[0].publisher,
      publicationDate: instance.publication[0].dateOfPublication,
      edition: instance.editions?.[0],
      contributors: [{
        contributor: instance.contributors[0].name,
        contributorNameTypeId: instance.contributors[0].contributorNameTypeId,
      }],
      productIds: [],
    });
  });
});
