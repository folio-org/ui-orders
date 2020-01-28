import {
  find,
  get,
  isEqual,
} from 'lodash';

export const getInventoryData = (state, initialValues) => {
  const { title, publisher, publicationDate, edition, contributors, productIds } = state;

  return {
    instanceId: get(state, 'instanceId', null) || get(initialValues, 'instanceId', null),
    title: title || get(initialValues, 'titleOrPackage', ''),
    publisher: publisher || get(initialValues, 'publisher', ''),
    publicationDate: publicationDate || get(initialValues, 'publicationDate', ''),
    edition: edition || get(initialValues, 'edition', ''),
    contributors: contributors.length
      ? contributors
      : get(initialValues, 'contributors', []),
    productIds: productIds.length
      ? productIds
      : get(initialValues, 'details.productIds', []),
  };
};

export const checkInstanceIdField = (formValues, inventoryData) => {
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
    && get(formValues, 'isPackage')
  );
};
