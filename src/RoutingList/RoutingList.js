import {
  useCallback,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useHistory,
  useParams,
} from 'react-router';

import {
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

import {
  useRoutingList,
  useRoutingListMutation,
} from './hooks';
import { RoutingListUsers } from './RoutingListUsers/RoutingListUsers';

export const RoutingList = () => {
  const accordionStatusRef = useRef();
  const history = useHistory();
  const showCallout = useShowCallout();
  const intl = useIntl();
  const { id } = useParams();

  const [isDeleteConfirmationVisible, toggleDeleteConfirmation] = useToggle(false);

  const { routingList, isLoading } = useRoutingList(id);
  const { deleteListing } = useRoutingListMutation();

  const onClose = useCallback(() => {
    history.goBack();
  }, [history]);

  const onDelete = async () => {
    toggleDeleteConfirmation();
    await deleteListing(
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
            data-testid="delete-routing-list"
            buttonStyle="dropdownItem"
            onClick={toggleDeleteConfirmation}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-orders.routing.list.actions.delete" />
            </Icon>
          </Button>
        </IfPermission>
      </div>
    );
  };

  const shortcuts = [
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
            <Accordion label={intl.formatMessage({ id: 'ui-orders.routing.list.generalInformation' })}>
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
            <Accordion label={intl.formatMessage({ id: 'ui-orders.routing.list.users' })}>
              <RoutingListUsers userIds={routingList.userIds} />
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
