import { buildMultiSelectionCqlQuery } from '@folio/stripes-acq-components';

export const buildRelationModifierQuery = (filterKey, relationModifier, filterValue) => {
  const modifiers = [{ name: relationModifier }];

  return buildMultiSelectionCqlQuery(filterKey, filterValue, { modifiers });
};
