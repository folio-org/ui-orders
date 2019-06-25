import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { map, get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

function FundDistributionView({ line = {}, funds = [] }) {
  const { fundDistribution = [], cost } = line;
  const fundsToDisplay = fundDistribution.map(({ fundId, percentage }) => {
    const { name = '', code = '' } = funds.find(({ id }) => id === fundId) || {};

    return {
      code,
      name,
      percentage,
    };
  });

  const names = map(fundsToDisplay, 'name').join(', ');
  const codes = map(fundsToDisplay, 'code').join(', ');
  const percentages = fundsToDisplay.map(val => `${val.percentage}%`).join(', ');
  const estimatedPrice = get(cost, 'poLineEstimatedPrice') || 0;
  const amount = fundsToDisplay.map(d => ((d.percentage / 100) * estimatedPrice).toFixed(2)).join(', ');

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.fundDistribution.id" />}
          value={names}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.fundDistribution.percent" />}
          value={percentages}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.fundDistribution.code" />}
          value={codes}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.fundDistribution.amount" />}
          value={amount}
        />
      </Col>
    </Row>
  );
}

FundDistributionView.propTypes = {
  line: PropTypes.shape({
    fundDistribution: PropTypes.arrayOf(PropTypes.object),
    cost: PropTypes.object,
  }),
  funds: PropTypes.arrayOf(PropTypes.object),
};

FundDistributionView.defaultProps = {
  line: {
    fundDistribution: [],
    cost: {},
  },
  funds: [],
};

export default FundDistributionView;
