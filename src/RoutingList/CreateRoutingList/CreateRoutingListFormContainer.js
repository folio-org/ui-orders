import noop from 'lodash/noop';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useParams,
} from 'react-router';

import { useShowCallout } from '@folio/stripes-acq-components';

import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import { useRoutingListMutation } from '../hooks';
import RoutingListForm from '../RoutingListForm';

export const CreateRoutingListFormContainer = () => {
  const showCallout = useShowCallout();
  const history = useHistory();
  const { poLineId } = useParams();
  const { createListing } = useRoutingListMutation();

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const onSubmit = async (values) => {
    return createListing({ ...values, poLineId }, {
      onSuccess: () => {
        onClose();
        showCallout({ messageId: 'ui-orders.routing.list.create.success' });
      },
      onError: async (error) => {
        const errorResponse = await error.response.json();
        const errorCode = errorResponse.errors[0]?.code;
        let errorMessage = 'ui-orders.routing.list.create.error';

        if (errorCode === UNIQUE_NAME_ERROR_CODE) {
          errorMessage = 'ui-orders.routing.list.create.error.nameMustBeUnique';
        }

        showCallout({
          messageId: errorMessage,
          type: 'error',
        });
      },
    });
  };

  return (
    <RoutingListForm
      onCancel={onClose}
      onDelete={noop}
      onSubmit={onSubmit}
      initialValues={{}}
      paneTitle={<FormattedMessage id="ui-orders.routing.list.create.label" />}
    />
  );
};
