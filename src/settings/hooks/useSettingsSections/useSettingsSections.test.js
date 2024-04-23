import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import {
  SETTINGS_SECTION_KEY_FIELD_NAME,
  SETTINGS_SECTION_ORDER_FIELD_NAME,
} from './constants';
import { useSettingsSections } from './useSettingsSections';

describe('useSettingsSections', () => {
  it('should initialize with the correct value', () => {
    const initialSections = [
      { label: 'section1' },
      {
        label: 'section2',
        [SETTINGS_SECTION_ORDER_FIELD_NAME]: 2,
      },
    ];
    const { result } = renderHook(() => useSettingsSections(initialSections));

    expect(result.current.sections).toEqual([
      { label: 'section1', [SETTINGS_SECTION_ORDER_FIELD_NAME]: 0 },
      { label: 'section2', [SETTINGS_SECTION_ORDER_FIELD_NAME]: 2 },
    ]);
  });

  it('should insert new section with position', () => {
    const { result } = renderHook(() => useSettingsSections([]));

    act(() => {
      result.current.insertSection({ label: 'section1' }, 1);
    });

    expect(result.current.sections).toEqual([{ label: 'section1', [SETTINGS_SECTION_ORDER_FIELD_NAME]: 1 }]);
  });

  it('should insert new section without position', () => {
    const initialSections = [
      { label: 'section1', [SETTINGS_SECTION_ORDER_FIELD_NAME]: 1 },
    ];
    const { result } = renderHook(() => useSettingsSections(initialSections));

    act(() => {
      result.current.insertSection({ label: 'section2' });
    });

    expect(result.current.sections).toEqual([
      { label: 'section1', [SETTINGS_SECTION_ORDER_FIELD_NAME]: 1 },
      { label: 'section2', [SETTINGS_SECTION_ORDER_FIELD_NAME]: 2 },
    ]);
  });

  it('should not insert section with existing key', () => {
    const initialSection = {
      [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key1',
      label: 'section1',
    };
    const { result } = renderHook(() => useSettingsSections([initialSection]));

    act(() => {
      result.current.insertSection({
        [SETTINGS_SECTION_KEY_FIELD_NAME]: 'key1',
        [SETTINGS_SECTION_ORDER_FIELD_NAME]: 1,
        label: 'section1',
      });
    });

    expect(result.current.sections).toEqual([{
      ...initialSection,
      [SETTINGS_SECTION_ORDER_FIELD_NAME]: 0,
    }]);
  });
});
