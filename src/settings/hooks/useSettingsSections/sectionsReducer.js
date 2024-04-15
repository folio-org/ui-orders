import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';

import {
  SETTINGS_SECTIONS_REDUCER_ACTIONS,
  SETTINGS_SECTION_KEY_FIELD_NAME,
  SETTINGS_SECTION_ORDER_FIELD_NAME,
} from './constants';

const getNewSectionOrderNumber = (sections, section) => {
  const fieldName = SETTINGS_SECTION_ORDER_FIELD_NAME;

  return section[fieldName] ?? (maxBy(sections, fieldName)?.[fieldName] || 0) + 1;
};

export const sectionsReducer = (state, action) => {
  switch (action.type) {
    case SETTINGS_SECTIONS_REDUCER_ACTIONS.INSERT_SECTION: {
      const isAlreadyExists = state.sections.find((section) => {
        return (
          Object.prototype.hasOwnProperty.call(section, SETTINGS_SECTION_KEY_FIELD_NAME)
          && Object.prototype.hasOwnProperty.call(action.data, SETTINGS_SECTION_KEY_FIELD_NAME)
          && section[SETTINGS_SECTION_KEY_FIELD_NAME] === action.data[SETTINGS_SECTION_KEY_FIELD_NAME]
        );
      });

      if (isAlreadyExists) {
        return state;
      }

      const section = {
        ...action.data,
        [SETTINGS_SECTION_ORDER_FIELD_NAME]: getNewSectionOrderNumber(state.sections, action.data),
      };

      return {
        sections: orderBy([...state.sections, section], SETTINGS_SECTION_ORDER_FIELD_NAME),
      };
    }
    default: {
      return state;
    }
  }
};
