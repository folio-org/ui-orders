import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, entries, orderBy, find, last } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Callout } from '@folio/stripes/components';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../../common/constants';
import { CLOSING_REASONS } from '../../components/Utils/resources';
import {
  CONFIG_CLOSING_REASONS,
  MODULE_ORDERS,
} from '../../components/Utils/const';

import ClosingReasons from './ClosingReasons';

const DEFAULT_CLOSE_ORDER_REASONS_RECORDS = entries(DEFAULT_CLOSE_ORDER_REASONS).map(entry => ({
  code: entry[0],
  value: entry[1],
}));

class ClosingReasonsContainer extends Component {
  static manifest = Object.freeze({
    closingReasons: CLOSING_REASONS,
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    mutator: PropTypes.shape({
      closingReasons: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      closingReasons: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  };

  constructor(props) {
    super(props);

    this.callout = React.createRef();

    this.styles = {
      closingReasonsWrapper: {
        width: '100%',
      },
    };
  }

  removeReason = async (id) => {
    const { mutator: { closingReasons } } = this.props;

    try {
      await closingReasons.DELETE({ id });
      this.callout.current.sendCallout({ message: <FormattedMessage id="ui-orders.settings.closingReasons.remove.success" /> });
    } catch (e) {
      this.callout.current.sendCallout({
        message: <FormattedMessage id="ui-orders.settings.closingReasons.remove.error" />,
        type: 'error',
      });
    }
  };

  saveReason = async (id, value) => {
    const reasons = get(this.props.resources, 'closingReasons.records', []);
    let reason;

    if (id) {
      reason = find(reasons, { id });
    } else {
      const CODE_PREFIX = 'CLOSING_REASON_';
      const lastReason = last(reasons) || { code: `${CODE_PREFIX}0` };
      const lastReasonCodeInt = +lastReason.code.split('_').pop();
      const code = `${CODE_PREFIX}${lastReasonCodeInt + 1}`;

      reason = {
        module: MODULE_ORDERS,
        configName: CONFIG_CLOSING_REASONS,
        code,
      };
    }

    reason = { ...reason, value };

    const { mutator: { closingReasons } } = this.props;
    const mutatorMethod = reason.id ? closingReasons.PUT : closingReasons.POST;

    try {
      await mutatorMethod(reason);
      this.callout.current.sendCallout({ message: <FormattedMessage id="ui-orders.settings.closingReasons.save.success" /> });
    } catch (e) {
      this.callout.current.sendCallout({
        message: <FormattedMessage id="ui-orders.settings.closingReasons.save.error" />,
        type: 'error',
      });
    }
  };

  render() {
    const { label, resources } = this.props;

    const closingReasons = orderBy(
      [
        ...DEFAULT_CLOSE_ORDER_REASONS_RECORDS,
        ...get(resources, 'closingReasons.records', []),
      ],
      reason => reason.value.toLowerCase(),
    );

    return (
      <div
        style={this.styles.closingReasonsWrapper}
        data-test-order-settings-closing-orders
      >
        <ClosingReasons
          title={label}
          reasons={closingReasons}
          saveReason={this.saveReason}
          removeReason={this.removeReason}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default ClosingReasonsContainer;
