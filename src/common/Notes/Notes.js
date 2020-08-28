import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import {
  AcqNoteCreatePage,
  AcqNoteEditPage,
  AcqNoteViewPage,
} from '@folio/stripes-acq-components';

import {
  NOTES_ROUTE,
  ORDERS_DOMAIN,
  ORDERS_ROUTE,
} from '../constants';
import {
  ENTITY_TYPE_PLURALIZED_TRANSLATION_KEYS,
  ENTITY_TYPE_TRANSLATION_KEYS,
  PANE_HEADER_APP_ICON,
} from './const';

const Notes = () => {
  return (
    <Switch>
      <Route
        exact
        path={`${NOTES_ROUTE}/new`}
        render={() => (
          <AcqNoteCreatePage
            domain={ORDERS_DOMAIN}
            entityTypeTranslationKeys={ENTITY_TYPE_TRANSLATION_KEYS}
            fallbackPath={ORDERS_ROUTE}
            paneHeaderAppIcon={PANE_HEADER_APP_ICON}
          />
        )}
      />
      <Route
        exact
        path={`${NOTES_ROUTE}/:id`}
        render={() => (
          <AcqNoteViewPage
            entityTypePluralizedTranslationKeys={ENTITY_TYPE_PLURALIZED_TRANSLATION_KEYS}
            entityTypeTranslationKeys={ENTITY_TYPE_TRANSLATION_KEYS}
            fallbackPath={ORDERS_ROUTE}
            notesPath={NOTES_ROUTE}
            paneHeaderAppIcon={PANE_HEADER_APP_ICON}
          />
        )}
      />
      <Route
        exact
        path={`${NOTES_ROUTE}/:id/edit`}
        render={() => (
          <AcqNoteEditPage
            domain={ORDERS_DOMAIN}
            entityTypePluralizedTranslationKeys={ENTITY_TYPE_PLURALIZED_TRANSLATION_KEYS}
            entityTypeTranslationKeys={ENTITY_TYPE_TRANSLATION_KEYS}
            notesPath={NOTES_ROUTE}
            paneHeaderAppIcon={PANE_HEADER_APP_ICON}
          />
        )}
      />
    </Switch>
  );
};

export default Notes;
