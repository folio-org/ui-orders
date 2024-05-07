import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useParams,
} from 'react-router';

import {
  useShowCallout,
  useToggle,
} from '@folio/stripes-acq-components';
import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';

import { UNIQUE_NAME_ERROR_CODE } from '../constants';
import {
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import RoutingListForm from '../RoutingListForm';

export const EditRoutingListFormContainer = () => {
  const showCallout = useShowCallout();
  const history = useHistory();
  const { id } = useParams();
  const { routingList, isLoading } = useRoutingList(id);
  const { deleteListing, updateListing } = useRoutingListMutation();

  const [isDeleteConfirmationVisible, toggleDeleteConfirmation] = useToggle(false);

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const onMutationSuccess = useCallback((messageId = 'ui-orders.routing.list.update.success') => {
    onClose();
    showCallout({ messageId });
  }, [onClose, showCallout]);

  const onMutationError = useCallback(async (error, messageId) => {
    const errorResponse = await error.response.json();
    const errorCode = errorResponse.errors[0]?.code;
    let errorMessage = messageId;

    if (errorCode === UNIQUE_NAME_ERROR_CODE) {
      errorMessage = 'ui-orders.routing.list.create.error.nameMustBeUnique';
    }

    showCallout({
      messageId: errorMessage,
      type: 'error',
    });
  }, [showCallout]);

  const onDelete = async () => {
    toggleDeleteConfirmation();
    await deleteListing(
      routingList.id,
      {
        onSuccess: () => onMutationSuccess('ui-orders.routing.list.delete.success'),
        onError: () => onMutationError('ui-orders.routing.list.delete.error'),
      },
    );
  };

  const onSubmit = (values) => {
    return updateListing(values, {
      onSuccess: () => onMutationSuccess('ui-orders.routing.list.update.success'),
      onError: (error) => onMutationError(error, 'ui-orders.routing.list.update.error'),
    });
  };

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <RoutingListForm
        onCancel={onClose}
        onDelete={toggleDeleteConfirmation}
        onSubmit={onSubmit}
        initialValues={routingList}
        paneTitle={routingList?.name}
      />
      {isDeleteConfirmationVisible && (
        <ConfirmationModal
          id="delete-routing-list-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.routing.list.delete.confirm.label" />}
          heading={<FormattedMessage id="ui-orders.routing.list.delete.confirm.title" />}
          message={<FormattedMessage id="ui-orders.routing.list.delete.confirm" />}
          onCancel={toggleDeleteConfirmation}
          onConfirm={onDelete}
          open
        />
      )}
    </>
  );
};
