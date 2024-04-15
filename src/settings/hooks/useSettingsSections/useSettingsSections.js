import {
  useCallback,
  useReducer,
  useState,
} from 'react';

import {
  SETTINGS_SECTIONS_REDUCER_ACTIONS,
  SETTINGS_SECTION_ORDER_FIELD_NAME,
} from './constants';
import { sectionsReducer } from './sectionsReducer';

const buildInitialSectionsList = (sections = []) => {
  const hydratedSections = sections.map((section, i) => {
    return {
      ...section,
      [SETTINGS_SECTION_ORDER_FIELD_NAME]: section[SETTINGS_SECTION_ORDER_FIELD_NAME] ?? i,
    };
  });

  return {
    sections: hydratedSections,
  };
};

export const useSettingsSections = (initialSections) => {
  /*
    `Settings` uses a list of sections stored in an internal field of the component instance,
    which is set when the constructor is called based on the passed `sections` prop.
    However, changing this prop does not update the displayed list of sections on the screen,
    so we need to forcibly re-render the `Settings` component.
  */
  const [key, setKey] = useState(Date.now());
  const [state, dispatch] = useReducer(sectionsReducer, initialSections, buildInitialSectionsList);

  const insertSection = useCallback((section, position) => {
    dispatch({
      type: SETTINGS_SECTIONS_REDUCER_ACTIONS.INSERT_SECTION,
      data: { section, position },
    });
    setKey(Date.now());
  }, []);

  return {
    insertSection,
    key,
    sections: state.sections,
  };
};
