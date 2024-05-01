import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  keyBy,
  map,
} from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useUsersBatch } from '@folio/stripes-acq-components';
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
  const { id } = user;

  return (
    <li key={id}>
      {getFullName(user)}
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
  const [openAddUsersModal, setOpenAddUsersModal] = useState(false);
  const [openUnAssignUsersModal, setOpenUnAssignUsersModal] = useState(false);

  const { isLoading, users } = useUsersBatch(userIds);

  const onCloseAddUsersModal = useCallback(() => setOpenAddUsersModal(false), []);

  const onSelectUsers = useCallback((selectedUsers) => {
    onCloseAddUsersModal();
    const newUserIds = map(selectedUsers.filter(({ id }) => !userIds.includes(id)), 'id');

    if (newUserIds.length) {
      onAddUsers([...userIds, ...newUserIds]);
    }
  }, [onAddUsers, onCloseAddUsersModal, userIds]);

  const onRemoveUser = useCallback((userId) => {
    onAddUsers(userIds.filter((id) => id !== userId));
  }, [onAddUsers, userIds]);

  const onUnassignAllUsers = useCallback(() => {
    onAddUsers([]);
    setOpenUnAssignUsersModal(false);
  }, [onAddUsers]);

  const selectedUsersMap = useMemo(() => keyBy(users, 'id'), [users]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <List
            items={users}
            listStyle="default"
            marginBottom0
            itemFormatter={user => renderItem({
              user,
              onRemoveUser,
              canRemove: canEdit,
            })}
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
                onClick={() => setOpenAddUsersModal(true)}
              >
                <FormattedMessage id="ui-orders.routing.list.addUsers" />
              </Button>
              <Button
                type="button"
                align="end"
                bottomMargin0
                disabled={!users.length}
                id="clickable-remove-all-permissions"
                onClick={setOpenUnAssignUsersModal}
              >
                <FormattedMessage id="ui-orders.routing.list.removeUsers" />
              </Button>
            </Col>
            <Pluggable
              aria-haspopup="true"
              openWhen={openAddUsersModal}
              dataKey="users"
              renderTrigger={() => null}
              searchButtonStyle="default"
              searchLabel={<FormattedMessage id="ui-orders.routing.list.addUsers" />}
              stripes={stripes}
              type="find-user"
              selectUsers={onSelectUsers}
              closeCB={onCloseAddUsersModal}
              initialSelectedUsers={selectedUsersMap}
            >
              <FormattedMessage id="ui-users.routing.list.addUsers.plugin.notAvailable" />
            </Pluggable>
          </Row>
        )
      }

      <ConfirmationModal
        open={openUnAssignUsersModal}
        heading={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-heading" />}
        message={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-message" />}
        onConfirm={onUnassignAllUsers}
        confirmLabel={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-continue" />}
        onCancel={() => setOpenUnAssignUsersModal(false)}
      />
    </>
  );
};

RoutingListUsers.propTypes = {
  canEdit: PropTypes.bool,
  onAddUsers: PropTypes.func.isRequired,
  userIds: PropTypes.arrayOf(PropTypes.string),
};

RoutingListUsers.defaultProps = {
  canEdit: false,
  userIds: [],
};
