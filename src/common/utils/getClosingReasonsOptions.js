import { sortBy } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getClosingReasonsOptions = (closingReasons = []) => sortBy(
  closingReasons.map(reason => ({
    label: reason.value,
    value: reason.value,
  })), 'label',
);
