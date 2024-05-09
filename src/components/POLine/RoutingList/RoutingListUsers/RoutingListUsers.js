import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  keyBy,
  map,
  noop,
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
  List,
  Loading,
  Row,
} from '@folio/stripes/components';

import { RoutingListUserItem } from './RoutingListUserItem';

export const RoutingListUsers = ({
  editable,
  onAddUsers,
  ids,
}) => {
  const stripes = useStripes();
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isUnassignUsersModalVisible, toggleUnassignUsersModal] = useToggle(false);

  const { isLoading, users } = useUsersBatch(ids, { keepPreviousData: true });

  const onSelectUsers = useCallback((selectedUsers) => {
    setIsAddUserModalVisible(false);
    const newUserIds = map(selectedUsers.filter(({ id }) => !ids?.includes(id)), 'id');

    if (newUserIds.length) {
      onAddUsers([...ids, ...newUserIds]);
    }
  }, [onAddUsers, ids]);

  const onRemoveUser = useCallback((userId) => {
    onAddUsers(ids.filter((id) => id !== userId));
  }, [onAddUsers, ids]);

  const onUnassignAllUsers = useCallback(() => {
    onAddUsers([]);
    toggleUnassignUsersModal();
  }, [onAddUsers, toggleUnassignUsersModal]);

  const selectedUsersMap = useMemo(() => (ids?.length ? keyBy(users, 'id') : {}), [users, ids]);

  const renderItem = useCallback((user) => (
    <RoutingListUserItem
      canRemove={editable}
      onRemove={onRemoveUser}
      user={user}
    />
  ), [editable, onRemoveUser]);

  if (isLoading) return <Loading />;

  return (
    <>
      <Row>
        <Col xs={12}>
          <List
            items={ids?.length ? users : []}
            listStyle="default"
            marginBottom0
            itemFormatter={renderItem}
            isEmptyMessage={<FormattedMessage id="ui-orders.routing.list.users.empty" />}
          />
        </Col>
      </Row>
      {
        editable && (
          <Row>
            <Col xs={12}>
              <Button
                type="button"
                align="end"
                bottomMargin0
                id="clickable-add-permission"
                onClick={() => setIsAddUserModalVisible(true)}
              >
                <FormattedMessage id="ui-orders.routing.list.addUsers" />
              </Button>
              <Button
                type="button"
                align="end"
                bottomMargin0
                disabled={!ids?.length}
                id="clickable-remove-all-permissions"
                onClick={toggleUnassignUsersModal}
              >
                <FormattedMessage id="ui-orders.routing.list.removeUsers" />
              </Button>
            </Col>
            <Pluggable
              aria-haspopup="true"
              openWhen={isAddUserModalVisible}
              dataKey="users"
              renderTrigger={noop}
              searchButtonStyle="default"
              searchLabel={<FormattedMessage id="ui-orders.routing.list.addUsers" />}
              stripes={stripes}
              type="find-user"
              selectUsers={onSelectUsers}
              closeCB={() => setIsAddUserModalVisible(false)}
              initialSelectedUsers={selectedUsersMap}
              showCreateUserButton
            >
              <FormattedMessage id="ui-users.routing.list.addUsers.plugin.notAvailable" />
            </Pluggable>
          </Row>
        )
      }

      <ConfirmationModal
        open={isUnassignUsersModalVisible}
        heading={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-heading" />}
        message={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-message" />}
        onConfirm={onUnassignAllUsers}
        confirmLabel={<FormattedMessage id="ui-orders.routing.list.create.unassign.confirm-continue" />}
        onCancel={toggleUnassignUsersModal}
      />
    </>
  );
};

RoutingListUsers.propTypes = {
  editable: PropTypes.bool,
  onAddUsers: PropTypes.func,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

RoutingListUsers.defaultProps = {
  editable: false,
};
