import React from 'react';

import { AcqNoteCreatePage } from '@folio/stripes-acq-components';

import {
  ORDERS_DOMAIN,
  ORDERS_ROUTE,
} from '../constants';
import {
  ENTITY_TYPE_TRANSLATION_KEYS,
  PANE_HEADER_APP_ICON,
} from './const';

const NoteCreate = () => {
  return (
    <AcqNoteCreatePage
      domain={ORDERS_DOMAIN}
      entityTypeTranslationKeys={ENTITY_TYPE_TRANSLATION_KEYS}
      fallbackPath={ORDERS_ROUTE}
      paneHeaderAppIcon={PANE_HEADER_APP_ICON}
    />
  );
};

export default NoteCreate;
