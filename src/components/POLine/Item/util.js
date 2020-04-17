import {
  find,
  get,
  isEqual,
} from 'lodash';

// transform form's initialValues to the state of data from inventory
export const getInventoryData = (initialValues) => {
  return {
    instanceId: get(initialValues, 'instanceId', null),
    title: get(initialValues, 'titleOrPackage', ''),
    publisher: get(initialValues, 'publisher', ''),
    publicationDate: get(initialValues, 'publicationDate', ''),
    edition: get(initialValues, 'edition', ''),
    contributors: get(initialValues, 'contributors', []),
    productIds: get(initialValues, 'details.productIds', []),
  };
};

// It compares actual form data (formValues) to contain data came from inventory or initial get request (inventoryData)
export const shouldSetInstanceId = (formValues, inventoryData) => {
  const isEqualContributors = inventoryData.contributors.every(el => {
    const contributor = find(get(formValues, 'contributors', []), { 'contributor': el.contributor });

    return contributor ? isEqual(contributor, el) : false;
  });

  const formProductIds = get(formValues, 'details.productIds', []);

  const isEqualProductIds = formProductIds.every(item => {
    const productId = find(inventoryData.productIds, { 'productId': item.productId });

    return productId ? isEqual(productId, item) : false;
  });

  return (
    inventoryData.instanceId
    && (inventoryData.title === get(formValues, 'titleOrPackage', ''))
    && (inventoryData.publisher === get(formValues, 'publisher', ''))
    && (inventoryData.publicationDate === get(formValues, 'publicationDate', ''))
    && (inventoryData.edition === get(formValues, 'edition', ''))
    && isEqualContributors
    && isEqualProductIds
    && !formValues?.isPackage
  );
};
