export const formatPublishers = (publishers = []) => {
  return publishers
    .filter(Boolean)
    .map(p => {
      const dateOfPublication = p.dateOfPublication ? ` (${p.dateOfPublication})` : '';

      return `${p.publisher}${dateOfPublication}`;
    })
    .join(', ');
};

export const formatContributors = (contributors = []) => {
  return contributors
    .filter(Boolean)
    .map(({ name }) => name)
    .join('; ');
};

export const formatRelations = (parents = [], children = [], relationTypes = []) => {
  const relationTypesMap = relationTypes.reduce((acc, rType) => {
    acc[rType.id] = rType.name;

    return acc;
  }, {});
  const childRelations = children.map(r => `${relationTypesMap[r.instanceRelationshipTypeId]} (M)`);
  const perentRelations = parents.map(r => `${relationTypesMap[r.instanceRelationshipTypeId]}`);

  return [...perentRelations, ...childRelations][0] || '';
};
