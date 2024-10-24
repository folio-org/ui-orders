export const buildRelationModifierQuery = (filterKey, relationModifier, filterValue) => {
  return `${filterKey}=/@${relationModifier} (${Array.isArray(filterValue) ? filterValue.join(' or ') : filterValue})`;
};
