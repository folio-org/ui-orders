import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  Callout,
} from '@folio/stripes/components';

import {
  CONFIG_APPROVALS,
  MODULE_ORDERS,
} from '../../components/Utils/const';
import { CONFIG_API } from '../../components/Utils/api';
import OrderApprovalsForm from './OrderApprovalsForm';

class OrderApprovals extends Component {
  static manifest = Object.freeze({
    linesLimit: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_APPROVALS})`,
        },
      },
    },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    mutator: PropTypes.shape({
      linesLimit: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      linesLimit: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  };

  constructor(props) {
    super(props);

    this.styles = {
      orderApprovalFormWrapper: {
        width: '100%',
      },
    };
  }

  onChangeOrderApprovalFormSubmit = values => {
    const { linesLimit } = this.props.mutator;
  }

  handleChangeOrderApprovalSuccess = () => {
    const successMessage = (
      <SafeHTMLMessage id="ui-orders.settings.setPOLInesLimit.changed" />
    );

    this.callout.sendCallout({ message: successMessage });
  };

  createCalloutRef = ref => {
    this.callout = ref;
  };

  render() {
    const { label, resources } = this.props;
    const initialValues = get(resources, ['linesLimit', 'records', 0], {});

    return (
      <div
        data-test-order-settings-lines-limit
        style={this.styles.orderApprovalFormWrapper}
      >
        <OrderApprovalsForm
          initialValues={initialValues}
          onSubmit={this.onChangeOrderApprovalFormSubmit}
          paneTitle={label}
        />
        <Callout ref={this.createCalloutRef} />
      </div>
    );
  }
}

export default OrderApprovals;
