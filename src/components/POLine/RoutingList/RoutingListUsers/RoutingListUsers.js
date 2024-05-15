import {
  useCallback,
  useMemo,
} from 'react';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  DragDropMCL,
  useToggle,
  useUsersBatch,
} from '@folio/stripes-acq-components';
import {
  Button,
  Col,
  ConfirmationModal,
  Layout,
  Loading,
  Row,
} from '@folio/stripes/components';
import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import {
  ROUTING_LIST_USERS_COLUMN_MAPPING,
  VISIBLE_COLUMNS,
  columnWidths,
} from './constants';
import { getRoutingListUsersFormatter } from './utils';

import css from './RoutingListUsers.css';

export const RoutingListUsers = ({
  editable,
  onAddUsers,
  ids,
}) => {
  const stripes = useStripes();
  const [isUnassignUsersModalVisible, toggleUnassignUsersModal] = useToggle(false);

  const { isLoading, users } = useUsersBatch(ids, { keepPreviousData: true });

  const onSelectUsers = useCallback((selectedUsers) => {
    const addedUserIds = new Set(ids);
    const newUserIds = map(selectedUsers.filter(({ id }) => !addedUserIds?.has(id)), 'id');

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
  const orderedUsersList = useMemo(() => {
    return ids?.map((id) => selectedUsersMap[id]);
  }, [ids, selectedUsersMap]);

  const onUpdate = (newLinesList) => {
    const updatedLinesList = newLinesList.map(({ id }) => id);

    onAddUsers(updatedLinesList);
  };

  const formatter = getRoutingListUsersFormatter({ onRemoveUser, editable });

  if (isLoading) return <Loading />;

  return (
    <>
      <Row>
        <Col xs={12}>
          <DragDropMCL
            contentData={orderedUsersList}
            columnMapping={ROUTING_LIST_USERS_COLUMN_MAPPING}
            formatter={formatter}
            id="users-draggable-list"
            loading={isLoading}
            onUpdate={onUpdate}
            isEmptyMessage={<FormattedMessage id="ui-orders.routing.list.users.empty" />}
            visibleColumns={VISIBLE_COLUMNS}
            isRowDraggable={() => editable}
            columnWidths={columnWidths}
          />
        </Col>
      </Row>
      {
        editable && (
          <Layout className={`flex full ${css.actions}`}>
            <Pluggable
              aria-haspopup="true"
              dataKey="users"
              searchButtonStyle="default"
              searchLabel={<FormattedMessage id="ui-orders.routing.list.addUsers" />}
              stripes={stripes}
              type="find-user"
              selectUsers={onSelectUsers}
              initialSelectedUsers={selectedUsersMap}
              showCreateUserButton
            >
              <FormattedMessage id="ui-users.routing.list.addUsers.plugin.notAvailable" />
            </Pluggable>
            <Button
              type="button"
              buttonClass={css.unassignAll}
              disabled={!ids?.length}
              id="clickable-remove-all-permissions"
              onClick={toggleUnassignUsersModal}
            >
              <FormattedMessage id="ui-orders.routing.list.removeUsers" />
            </Button>
          </Layout>
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
