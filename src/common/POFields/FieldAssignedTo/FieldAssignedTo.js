import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  TextField,
  IconButton,
} from '@folio/stripes/components';
import {
  withStripes,
  stripesShape,
  Pluggable,
} from '@folio/stripes/core';

import styles from './FieldAssignedTo.css';

const columnMapping = {
  name: <FormattedMessage id="ui-orders.user.name" />,
  patronGroup: <FormattedMessage id="ui-orders.user.patronGroup" />,
  username: <FormattedMessage id="ui-orders.user.username" />,
  barcode: <FormattedMessage id="ui-orders.user.barcode" />,
};
const visibleColumns = ['name', 'patronGroup', 'username', 'barcode'];

class FieldAssignedTo extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    change: PropTypes.func.isRequired,
    assignedToValue: PropTypes.string,
  };

  static defaultProps = {
    assignedToValue: '',
  };

  clearUser = () => {
    const { change } = this.props;

    change('assignedToUser', '');
    change('assignedTo', null);
  };

  addUser = (user) => {
    const { change } = this.props;

    change('assignedToUser', `${user.personal.firstName} ${user.personal.lastName}`);
    change('assignedTo', `${user.id}`);
  };

  renderClearButton = () => {
    const { assignedToValue } = this.props;

    if (assignedToValue && assignedToValue.length > 0) {
      return (
        <IconButton
          onClick={this.clearUser}
          icon="times-circle-solid"
          size="small"
        />
      );
    }

    return null;
  };

  renderUsersPlugin = () => {
    const { stripes } = this.props;

    return (
      <Pluggable
        aria-haspopup="true"
        type="find-user"
        dataKey="user"
        searchLabel="+"
        searchButtonStyle="default"
        selectUser={this.addUser}
        visibleColumns={visibleColumns}
        columnMapping={columnMapping}
        disableRecordCreation
        stripes={stripes}
      >
        <span>[no user-selection plugin]</span>
      </Pluggable>
    );
  };

  render() {
    return (
      <div className={styles.FieldAssignedToWrapper}>
        <Field
          component={TextField}
          disabled
          endControl={this.renderClearButton()}
          fullWidth
          hasClearIcon={false}
          label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
          name="assignedToUser"
        />
        <div className={styles.FieldAssignedToButtonWrapper}>
          {this.renderUsersPlugin()}
        </div>
      </div>
    );
  }
}

export default withStripes(FieldAssignedTo);
