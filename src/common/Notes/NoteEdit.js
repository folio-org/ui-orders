import React from 'react';

import { AcqNoteEditPage } from '@folio/stripes-acq-components';

import {
  NOTES_ROUTE,
  ORDERS_DOMAIN,
} from '../constants';
import {
  ENTITY_TYPE_PLURALIZED_TRANSLATION_KEYS,
  ENTITY_TYPE_TRANSLATION_KEYS,
  PANE_HEADER_APP_ICON,
} from './const';

const NoteEdit = () => {
  return (
    <AcqNoteEditPage
      domain={ORDERS_DOMAIN}
      entityTypePluralizedTranslationKeys={ENTITY_TYPE_PLURALIZED_TRANSLATION_KEYS}
      entityTypeTranslationKeys={ENTITY_TYPE_TRANSLATION_KEYS}
      notesPath={NOTES_ROUTE}
      paneHeaderAppIcon={PANE_HEADER_APP_ICON}
    />
  );
};

export default NoteEdit;
