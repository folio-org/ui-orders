import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  IconButton,
  TextField,
} from '@folio/stripes/components';
import {
  Pluggable,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';

import { USERS } from '../../../components/Utils/resources';
import { PO_FORM_FIELDS } from '../../constants';
import { getUserNameById } from '../../utils';

import styles from './FieldAssignedTo.css';

const columnMapping = {
  name: <FormattedMessage id="ui-orders.user.name" />,
  patronGroup: <FormattedMessage id="ui-orders.user.patronGroup" />,
  username: <FormattedMessage id="ui-orders.user.username" />,
  barcode: <FormattedMessage id="ui-orders.user.barcode" />,
};
const visibleColumns = ['name', 'patronGroup', 'username', 'barcode'];

function FieldAssignedTo({ change, userId, mutator, stripes }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);
  const [username, setUsername] = useState();

  useEffect(() => {
    getUserNameById(memoizedMutator.users, userId)
      .then(setUsername);
  }, [memoizedMutator.users, userId]);

  const clearUser = useCallback(() => {
    change('assignedTo', null);
  }, [change]);

  const addUser = useCallback((user) => {
    setUsername(getFullName(user));
    change('assignedTo', user.id);
  }, [change]);

  const clearButton = useMemo(() => {
    if (username) {
      return (
        <IconButton
          onClick={clearUser}
          icon="times-circle-solid"
          size="small"
        />
      );
    }

    return null;
  }, [clearUser, username]);

  return (
    <div className={styles.FieldAssignedToWrapper}>
      <Field
        component={TextField}
        disabled
        endControl={clearButton}
        format={() => username}
        fullWidth
        hasClearIcon={false}
        label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
        name={PO_FORM_FIELDS.assignedTo}
        validateFields={[]}
      />
      <div className={styles.FieldAssignedToButtonWrapper}>
        <Pluggable
          aria-haspopup="true"
          type="find-user"
          dataKey="user"
          searchLabel="+"
          searchButtonStyle="default"
          selectUser={addUser}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          disableRecordCreation
          stripes={stripes}
        >
          <span>[<FormattedMessage id="stripes-acq-components.no-ui-plugin-find-user" />]</span>
        </Pluggable>
      </div>
    </div>
  );
}

FieldAssignedTo.propTypes = {
  change: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  userId: PropTypes.string,
};

FieldAssignedTo.manifest = Object.freeze({
  users: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(FieldAssignedTo);
