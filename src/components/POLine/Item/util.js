import {
  find,
  get,
  isEqual,
} from 'lodash';

import { PRODUCT_ID_TYPE, QUALIFIER_SEPARATOR } from '../../../common/constants';

// transform form's initialValues to the state of data from inventory
export const getInventoryData = (initialValues) => {
  return {
    instanceId: get(initialValues, 'instanceId', null),
    title: get(initialValues, 'titleOrPackage', ''),
    publisher: get(initialValues, 'publisher', ''),
    publicationDate: get(initialValues, 'publicationDate', null),
    edition: get(initialValues, 'edition', ''),
    contributors: get(initialValues, 'contributors', []),
    productIds: get(initialValues, 'details.productIds', []),
  };
};

export const getNormalizedInventoryData = (inventoryData) => {
  const { productIds, title, ...data } = inventoryData;

  return {
    titleOrPackage: title,
    details: { productIds },
    ...data,
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
    && (inventoryData.publicationDate === get(formValues, 'publicationDate', null))
    && (inventoryData.edition === get(formValues, 'edition', ''))
    && isEqualContributors
    && isEqualProductIds
    && !formValues?.isPackage
  );
};

export const createPOLDataFromInstance = (instance = {}, identifierTypes = []) => {
  const { contributors, editions, publication, title, identifiers, id } = instance;
  const { publisher } = publication?.[0] || {};
  const publicationDate = (publication || [])
    .map(({ dateOfPublication }) => dateOfPublication)
    .filter(Boolean)
    .join(', ');
  const lineContributors = contributors?.map(({ name, contributorNameTypeId }) => ({
    contributor: name,
    contributorNameTypeId,
  })) || [];
  let productIds = [];

  if (identifiers?.length) {
    const isbnTypeUUID = identifierTypes.find(({ label }) => label === PRODUCT_ID_TYPE.isbn).value;
    const allowedResIdentifierTypeIds = identifierTypes
      .map(({ value }) => value);
    const lineIdentifiers = identifiers
      .filter(({ identifierTypeId }) => allowedResIdentifierTypeIds.includes(identifierTypeId))
      .map(({ identifierTypeId, value }) => {
        const result = {
          productId: value,
          productIdType: identifierTypeId,
        };

        if (isbnTypeUUID === identifierTypeId) {
          const [productId, ...qualifier] = value.split(QUALIFIER_SEPARATOR);

          result.productId = productId;
          result.qualifier = qualifier.join(QUALIFIER_SEPARATOR);
        }

        return result;
      });

    productIds = lineIdentifiers;
  }

  return ({
    instanceId: id,
    titleOrPackage: title,
    publisher: publisher || '',
    publicationDate,
    edition: editions?.[0] || '',
    contributors: lineContributors,
    productIds,
  });
};
