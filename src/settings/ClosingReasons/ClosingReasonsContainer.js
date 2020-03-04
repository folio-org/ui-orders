import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { get, entries, orderBy, find, last } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Layout } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

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

function ClosingReasonsContainer({ label, mutator, resources }) {
  const sendCallout = useShowCallout();
  const removeReason = useCallback(
    async (id) => {
      const { closingReasons } = mutator;

      try {
        await closingReasons.DELETE({ id });
        sendCallout({ message: <FormattedMessage id="ui-orders.settings.closingReasons.remove.success" /> });
      } catch (e) {
        sendCallout({
          message: <FormattedMessage id="ui-orders.settings.closingReasons.remove.error" />,
          type: 'error',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sendCallout],
  );

  const saveReason = useCallback(
    async (id, value) => {
      const reasons = get(resources, 'closingReasons.records', []);
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

      const { closingReasons } = mutator;
      const mutatorMethod = reason.id ? closingReasons.PUT : closingReasons.POST;

      try {
        await mutatorMethod(reason);
        sendCallout({ message: <FormattedMessage id="ui-orders.settings.closingReasons.save.success" /> });
      } catch (e) {
        sendCallout({
          message: <FormattedMessage id="ui-orders.settings.closingReasons.save.error" />,
          type: 'error',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resources, sendCallout],
  );

  const closingReasons = orderBy(
    [
      ...DEFAULT_CLOSE_ORDER_REASONS_RECORDS,
      ...get(resources, 'closingReasons.records', []),
    ],
    reason => reason.value.toLowerCase(),
  );

  return (
    <Layout
      className="full"
      data-test-order-settings-closing-orders
    >
      <ClosingReasons
        title={label}
        reasons={closingReasons}
        saveReason={saveReason}
        removeReason={removeReason}
      />
    </Layout>
  );
}

ClosingReasonsContainer.manifest = Object.freeze({
  closingReasons: CLOSING_REASONS,
});

ClosingReasonsContainer.propTypes = {
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

export default ClosingReasonsContainer;
