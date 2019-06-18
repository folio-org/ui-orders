import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';

import { get } from 'lodash';

import {
  Col,
  KeyValue,
  RepeatableField,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { isWorkflowStatusOpen } from '../../PurchaseOrder/util';
import parseNumber from '../../Utils/parseNumber';
import { Required } from '../../Utils/Validate';
import calculateEstimatedPrice from '../calculateEstimatedPrice';

class FundDistributionForm extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    funds: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object.isRequired,
  };

  calculateAmount = (fund) => {
    const formValues = this.props.formValues;
    const estimatedPrice = calculateEstimatedPrice(formValues);
    const fundDistributionPercentage = fund.percentage || 0;
    const amount = ((fundDistributionPercentage / 100) * estimatedPrice).toFixed(2);

    return amount;
  };

  renderSubForm = (elem, index, fields) => {
    const { order, funds = [] } = this.props;
    const isOpenedOrder = isWorkflowStatusOpen(order);
    const fund = fields.get(index);
    const fundCode = get(funds.find(({ value }) => value === fund.fundId), 'code');
    const amount = this.calculateAmount(fund);

    return (
      <React.Fragment>
        <Col xs={4}>
          <Field
            component={Select}
            dataOptions={funds}
            fullWidth
            label={<FormattedMessage id="ui-orders.fundDistribution.id" />}
            name={`${elem}.fundId`}
            placeholder=" "
            required
            validate={[Required]}
            disabled={isOpenedOrder}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.fundDistribution.percent" />}
            name={`${elem}.percentage`}
            parse={parseNumber}
            type="number"
            validate={[Required]}
            disabled={isOpenedOrder}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.fundDistribution.code" />}
            value={fundCode}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.fundDistribution.amount" />}
            value={amount}
          />
        </Col>
      </React.Fragment>
    );
  }

  render() {
    const isOpenedOrder = isWorkflowStatusOpen(this.props.order);

    return (
      <Row>
        <Col xs={12}>
          <FieldArray
            addLabel={<FormattedMessage id="ui-orders.fundDistribution.addBtn" />}
            component={RepeatableField}
            name="fundDistribution"
            props={{
              canAdd: !isOpenedOrder,
              canRemove: !isOpenedOrder,
            }}
            renderField={this.renderSubForm}
          />
        </Col>
      </Row>
    );
  }
}

export default FundDistributionForm;
