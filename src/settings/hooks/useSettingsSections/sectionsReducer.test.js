import {
  SETTINGS_SECTIONS_REDUCER_ACTIONS,
  SETTINGS_SECTION_KEY_FIELD_NAME,
  SETTINGS_SECTION_ORDER_FIELD_NAME,
} from './constants';
import { sectionsReducer } from './sectionsReducer';

describe('sections reducer', () => {
  const initialState = {
    sections: [
      {
        [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key1',
        [SETTINGS_SECTION_ORDER_FIELD_NAME]: 1,
      },
      {
        [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key2',
        [SETTINGS_SECTION_ORDER_FIELD_NAME]: 2,
      },
    ],
  };

  it('should return the initial state', () => {
    expect(sectionsReducer([], {})).toEqual([]);
  });

  it('should handle "INSERT_SECTION" with a new section', () => {
    const newSection = {
      section: {
        [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key3',
      },
    };

    const expectedState = {
      sections: [
        initialState.sections[0],
        initialState.sections[1],
        {
          ...newSection.section,
          [SETTINGS_SECTION_ORDER_FIELD_NAME]: 3,
        },
      ],
    };

    expect(sectionsReducer(initialState, {
      type: SETTINGS_SECTIONS_REDUCER_ACTIONS.INSERT_SECTION,
      data: newSection,
    })).toEqual(expectedState);
  });

  it('should handle "INSERT_SECTION" with an existing key', () => {
    const existingSection = {
      section: {
        [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key1',
      },
    };

    expect(sectionsReducer(initialState, {
      type: SETTINGS_SECTIONS_REDUCER_ACTIONS.INSERT_SECTION,
      data: existingSection,
    })).toEqual(initialState);
  });

  it('should handle "INSERT_SECTION" with a provided section order', () => {
    const newSection = {
      section: {
        [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key3',
      },
      position: 1,
    };

    const expectedState = {
      sections: [
        initialState.sections[0],
        {
          ...newSection.section,
          [SETTINGS_SECTION_ORDER_FIELD_NAME]: 1,
        },
        initialState.sections[1],
      ],
    };

    expect(sectionsReducer(initialState, {
      type: SETTINGS_SECTIONS_REDUCER_ACTIONS.INSERT_SECTION,
      data: newSection,
    })).toEqual(expectedState);
  });
});
