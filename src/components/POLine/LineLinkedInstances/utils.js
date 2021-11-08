const ALLOWED_YEAR_LENGTH = 4;

export const createTitleBody = (instance, lineId) => {
  const contributors = instance?.contributors?.map(({ name, contributorNameTypeId }) => ({
    contributor: name,
    contributorNameTypeId,
  }));
  const productIds = instance?.identifiers?.map(({ identifierTypeId, value }) => ({
    productId: value,
    productIdType: identifierTypeId,
  }));
  const edition = instance?.editions?.[0];
  const publisher = instance?.publication?.[0]?.publisher;
  const publishedDate = instance?.publication?.[0]?.dateOfPublication?.length === ALLOWED_YEAR_LENGTH
    ? instance.publication[0].dateOfPublication
    : null;

  return ({
    title: instance.title,
    poLineId: lineId,
    instanceId: instance.id,
    contributors,
    productIds,
    edition,
    publisher,
    publishedDate,
  });
};
