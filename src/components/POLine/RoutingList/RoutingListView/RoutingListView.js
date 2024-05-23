import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';

import {
  handleKeyCommand,
  useShowCallout,
  useToggle,
} from '@folio/stripes-acq-components';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  KeyValue,
  LoadingView,
  Pane,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { ROUTING_LIST_ROUTE } from '../../../../common/constants';
import {
  useGoBack,
  useRoutingList,
  useRoutingListMutation,
} from '../hooks';
import { RoutingListUsers } from '../RoutingListUsers';

export const RoutingListView = () => {
  const accordionStatusRef = useRef();
  const showCallout = useShowCallout();
  const { id } = useParams();

  const [isDeleteConfirmationVisible, toggleDeleteConfirmation] = useToggle(false);

  const { routingList, isLoading } = useRoutingList(id);
  const { deleteRoutingList } = useRoutingListMutation();
  const onClose = useGoBack(routingList?.poLineId);

  const onDelete = async () => {
    toggleDeleteConfirmation();
    await deleteRoutingList(
      routingList.id,
      {
        onSuccess: () => {
          onClose();
          showCallout({
            messageId: 'ui-orders.routing.list.delete.success',
          });
        },
        onError: () => {
          showCallout({
            messageId: 'ui-orders.routing.list.delete.error',
            type: 'error',
          });
        },
      },
    );
  };

  const getActionMenu = () => {
    return (
      <>
        <IfPermission perm="orders.routing-lists.item.put">
          <Button
            buttonStyle="dropdownItem"
            to={`${ROUTING_LIST_ROUTE}/edit/${routingList.id}`}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-orders.routing.list.actions.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="orders.routing-lists.item.delete">
          <Button
            data-testid="delete-routing-list"
            buttonStyle="dropdownItem"
            onClick={toggleDeleteConfirmation}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-orders.routing.list.actions.delete" />
            </Icon>
          </Button>
        </IfPermission>
      </>
    );
  };

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onClose),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  if (isLoading) {
    return (
      <LoadingView
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
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
            <Accordion label={<FormattedMessage id="ui-orders.routing.list.generalInformation" />}>
              <AccordionSet>
                {routingList.metadata && <ViewMetaData metadata={routingList.metadata} />}
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
            <Accordion label={<FormattedMessage id="ui-orders.routing.list.users" />}>
              <RoutingListUsers ids={routingList.userIds} />
            </Accordion>
          </AccordionSet>
        </AccordionStatus>
      </Pane>
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
    </HasCommand>
  );
};
