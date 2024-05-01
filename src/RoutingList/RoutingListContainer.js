import {
  useCallback,
  useState,
} from 'react';
import { omit } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  useHistory,
  useParams,
} from 'react-router';

import { useShowCallout } from '@folio/stripes-acq-components';
import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';

import { UNIQUE_NAME_ERROR_CODE } from './constants';
import {
  useRoutingListById,
  useRoutingListMutation,
} from './hooks';
import RoutingListForm from './RoutingListForm';

import css from './RoutingList.css';

export const RoutingListContainer = () => {
  const showCallout = useShowCallout();
  const history = useHistory();
  const { id, poLineId } = useParams();
  const { routingList, isLoading } = useRoutingListById(id);
  const { deleteListing, createListing, updateListing } = useRoutingListMutation();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const showConfirmDelete = useCallback(() => setConfirmDelete(true), []);
  const hideConfirmDelete = useCallback(() => setConfirmDelete(false), []);

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const onMutationSuccess = useCallback((messageId = 'ui-orders.routing.list.update.success') => {
    onClose();
    showCallout({ messageId });
  }, [onClose, showCallout]);

  const onMutationError = useCallback((messageId = 'ui-orders.routing.list.update.error') => {
    showCallout({
      messageId,
      type: 'error',
    });
  }, [showCallout]);

  const onDelete = async () => {
    hideConfirmDelete();
    await deleteListing(
      routingList.id,
      {
        onSuccess: () => onMutationSuccess('ui-orders.routing.list.delete.success'),
        onError: () => onMutationError('ui-orders.routing.list.delete.error'),
      },
    );
  };

  const onSubmit = async (values) => {
    const dataToSave = omit(values, ['users']);

    if (routingList?.id) {
      await updateListing(dataToSave, {
        onSuccess: () => onMutationSuccess('ui-orders.routing.list.update.success'),
        onError: () => onMutationError('ui-orders.routing.list.update.error'),
      });
    } else {
      await createListing({ ...dataToSave, poLineId }, {
        onSuccess: () => onMutationSuccess('ui-orders.routing.list.create.success'),
        onError: async (error) => {
          const errorResponse = await error.response.json();
          const errorCode = errorResponse.errors[0]?.code;
          let errorMessage = 'ui-orders.routing.list.create.error';

          if (errorCode === UNIQUE_NAME_ERROR_CODE) {
            errorMessage = 'ui-orders.routing.list.create.error.nameMustBeUnique';
          }

          onMutationError(errorMessage);
        },
      });
    }
  };

  const paneTitle = routingList?.id ? routingList?.name : <FormattedMessage id="ui-orders.routing.list.create.label" />;

  if (isLoading) return <LoadingView dismissible onClose={onClose} />;

  return (
    <>
      <div
        data-test-order-settings-routing-address
        className={css.formWrapper}
      >
        <RoutingListForm
          onCancel={onClose}
          onDelete={showConfirmDelete}
          onSubmit={onSubmit}
          initialValues={routingList}
          paneTitle={paneTitle}
        />
      </div>
      {confirmDelete && (
        <ConfirmationModal
          id="delete-routing-list-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.routing.list.delete.confirm.label" />}
          heading={<FormattedMessage id="ui-orders.routing.list.delete.confirm.title" />}
          message={<FormattedMessage id="ui-orders.routing.list.delete.confirm" />}
          onCancel={hideConfirmDelete}
          onConfirm={onDelete}
          open
        />
      )}
    </>
  );
};
