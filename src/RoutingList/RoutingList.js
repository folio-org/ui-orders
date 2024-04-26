import { useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  KeyValue,
  List,
  LoadingView,
  Pane,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { FormattedMessage, useIntl } from 'react-intl';

import { useRoutingListById, useRoutingListMutation } from './hooks';

export const RoutingList = () => {
  const history = useHistory();
  const showCallout = useShowCallout();
  const intl = useIntl();
  const { id } = useParams();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const showConfirmDelete = useCallback(() => setConfirmDelete(true), []);
  const hideConfirmDelete = useCallback(() => setConfirmDelete(false), []);

  const { routingList, isLoading } = useRoutingListById(id);
  const { deleteListing } = useRoutingListMutation();

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

  const sortedUsers = useMemo(() => {
    return routingList.users?.sort((a, b) => a.name.localeCompare(b.name));
  }, [routingList]);

  const getActionMenu = () => {
    return (
      <div>
        <IfPermission perm="orders.routing-lists.item.put">
          <Button
            buttonStyle="dropdownItem"
            to={`/orders/routing-lists/edit/${routingList.id}`}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-orders.routing.list.actions.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="orders.routing-lists.item.delete">
          <Button
            buttonStyle="dropdownItem"
            onClick={showConfirmDelete}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-orders.routing.list.actions.delete" />
            </Icon>
          </Button>
        </IfPermission>
      </div>
    );
  };

  if (isLoading) return <LoadingView dismissible onClose={onClose} />;

  return (
    <>
      <Pane
        id="routing-list-pane"
        appIcon={<AppIcon app="orders" appIconKey="orders" />}
        defaultWidth="fill"
        paneTitle={routingList.name}
        dismissible
        onClose={onClose}
        actionMenu={getActionMenu}
      >
        <AccordionStatus>
          <Row end="xs">
            <Col data-test-expand-all>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion label={intl.formatMessage({ id: 'ui-orders.routing.list.generalInformation' })}>
              <AccordionSet>
                <ViewMetaData metadata={routingList.metadata} />
              </AccordionSet>
              <Row>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-orders.routing.list.name" />}
                    value={routingList.name}
                  />
                </Col>
                <Col xs={12}>
                  <KeyValue
                    label={<FormattedMessage id="ui-orders.routing.list.notes" />}
                    value={routingList.notes}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion label={intl.formatMessage({ id: 'ui-orders.routing.list.users' })}>
              <List
                items={sortedUsers}
                listStyle="default"
                marginBottom0
                itemFormatter={user => {
                  return (<li>{user.name}</li>);
                }}
              />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      </Pane>
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
