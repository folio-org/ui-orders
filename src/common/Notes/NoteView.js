import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { NoteViewPage } from '@folio/stripes/smart-components';

import {
  NOTES_ROUTE,
  ORDERS_ROUTE,
} from '../constants';
import { getReferredEntityData } from './util';

const NoteView = ({
  history,
  location: { state },
  match: { params: { id } },
}) => {
  const onEdit = useCallback(
    () => {
      history.replace({
        pathname: `${NOTES_ROUTE}/${id}/edit`,
        state,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const navigateBack = useCallback(
    () => {
      if (state) {
        history.goBack();
      } else {
        history.push({
          pathname: ORDERS_ROUTE,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const referredEntityData = getReferredEntityData(state);

  return (
    <div data-test-note-view-container>
      <NoteViewPage
        entityTypePluralizedTranslationKeys={{ poLine: 'ui-orders.poLine.pluralized' }}
        entityTypeTranslationKeys={{ poLine: 'ui-orders.poLine' }}
        navigateBack={navigateBack}
        noteId={id}
        onEdit={onEdit}
        paneHeaderAppIcon="orders"
        referredEntityData={referredEntityData}
      />
    </div>
  );
};

NoteView.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NoteView;
