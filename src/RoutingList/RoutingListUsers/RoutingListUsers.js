import {
  useCallback,
  useMemo,
} from 'react';
import {
  get,
  keyBy,
  map,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  useToggle,
  useUsersBatch,
} from '@folio/stripes-acq-components';
import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  Col,
  ConfirmationModal,
  Icon,
  List,
  Loading,
  Row,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

const renderItem = ({ canRemove, user, onRemoveUser }) => {
  const { id, personal } = user;
  const address = get(personal, 'addresses[0].addressLine1', '');

  return (
    <li key={id}>
      {getFullName(user)} - {address}
      {
        canRemove && (
          <Button
            buttonStyle="fieldControl"
            align="end"
            type="button"
            id={`clickable-remove-user-${id}`}
            onClick={() => onRemoveUser(id)}
          >
            <Icon icon="times-circle" />
          </Button>
        )
      }
    </li>
  );
};

export const RoutingListUsers = ({
  canEdit,
  onAddUsers,
  userIds,
}) => {
  const stripes = useStripes();
  const [isAddUserModalVisible, toggleAddUsersModal] = useToggle(false);
  const [isUnAssignUsersModalVisible, toggleUnAssignUsersModal] = useToggle(false);

  const { isLoading, users } = useUsersBatch(userIds, { keepPreviousData: true });

  const onSelectUsers = useCallback((selectedUsers) => {
    toggleAddUsersModal();
    const newUserIds = map(selectedUsers.filter(({ id }) => !userIds.includes(id)), 'id');

    if (newUserIds.length) {
      onAddUsers([...userIds, ...newUserIds]);
    }
  }, [onAddUsers, toggleAddUsersModal, userIds]);

  const onRemoveUser = useCallback((userId) => {
    onAddUsers(userIds.filter((id) => id !== userId));
  }, [onAddUsers, userIds]);

  const onUnassignAllUsers = useCallback(() => {
    onAddUsers([]);
    toggleUnAssignUsersModal();
  }, [onAddUsers, toggleUnAssignUsersModal]);

  const selectedUsersMap = useMemo(() => (userIds?.length ? keyBy(users, 'id') : {}), [users, userIds]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <List
            items={userIds?.length ? users : []}
            listStyle="default"
            marginBottom0
            itemFormatter={user => renderItem({
              user,
              onRemoveUser,
              canRemove: canEdit,
            })}
            isEmptyMessage={<FormattedMessage id="ui-orders.routing.list.users.empty" />}
          />
        </Col>
      </Row>
      {
        canEdit && (
          <Row>
            <Col xs={12}>
              <br />
              <Button
                type="button"
                align="end"
                bottomMargin0
                id="clickable-add-permission"
                onClick={toggleAddUsersModal}
              >
                <FormattedMessage id="ui-orders.routing.list.addUsers" />
              </Button>
              <Button
                type="button"
                align="end"
                bottomMargin0
                disabled={!users?.length}
                id="clickable-remove-all-permissions"
                onClick={toggleUnAssignUsersModal}
              >
                <FormattedMessage id="ui-orders.routing.list.removeUsers" />
              </Button>
            </Col>
            <Pluggable
              aria-haspopup="true"
              openWhen={isAddUserModalVisible}
              dataKey="users"
              renderTrigger={() => null}
              searchButtonStyle="default"
              searchLabel={<FormattedMessage id="ui-orders.routing.list.addUsers" />}
              stripes={stripes}
              type="find-user"
              selectUsers={onSelectUsers}
              closeCB={toggleAddUsersModal}
              initialSelectedUsers={selectedUsersMap}
              showCreateUserButton
            >
              <FormattedMessage id="ui-users.routing.list.addUsers.plugin.notAvailable" />
            </Pluggable>
          </Row>
        )
      }

      <ConfirmationModal
        open={isUnAssignUsersModalVisible}
        heading={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-heading" />}
        message={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-message" />}
        onConfirm={onUnassignAllUsers}
        confirmLabel={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-continue" />}
        onCancel={toggleUnAssignUsersModal}
      />
    </>
  );
};

RoutingListUsers.propTypes = {
  canEdit: PropTypes.bool,
  onAddUsers: PropTypes.func.isRequired,
  userIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

RoutingListUsers.defaultProps = {
  canEdit: false,
};
