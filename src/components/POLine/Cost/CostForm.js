import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { get } from 'lodash';

import {
  Col,
  InfoPopover,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  parseNumberFieldValue,
  validateRequiredNotNegative,
} from '@folio/stripes-acq-components';
import {
  withStripes,
  stripesShape,
} from '@folio/stripes/core';

import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import parseNumber from '../../Utils/parseNumber';
import FieldCurrency from './FieldCurrency';
import {
  DISCOUNT_TYPE,
  ERESOURCES,
  PHRESOURCES,
  OTHER,
} from '../const';
import calculateEstimatedPrice from '../calculateEstimatedPrice';

// Validation for Fields with type 'number' requires positive integer
export const requiredPositiveQuantity = (value) => {
  return value >= 1
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.shouldBePositive" />;
};

const FIELD_ATTRS_FOR_REQUIRED_PRICE = {
  required: true,
  validate: validateRequiredNotNegative,
};
const FIELD_ATTRS_FOR_REQUIRED_QUANTITY = {
  required: true,
  validate: requiredPositiveQuantity,
};
const ATTRS_TO_DISABLE_FIELD = {
  disabled: true,
};

const validateNotNegative = (value) => {
  return !value || value > 0
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.cantBeNegative" />;
};

class CostForm extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    dispatch: PropTypes.func,
    change: PropTypes.func,
    currencies: PropTypes.arrayOf(PropTypes.string),
    order: PropTypes.object.isRequired,
    required: PropTypes.bool,
    stripes: stripesShape.isRequired,
  };

  static defaultProps = {
    required: true,
  };

  normalizeDiscount = (value, previousValue, allValues, previousAllValues) => {
    if (!value) {
      return value;
    }

    const previousDiscountType = get(previousAllValues, 'cost.discountType');
    const discountType = value.includes('%')
      ? DISCOUNT_TYPE.percentage
      : DISCOUNT_TYPE.amount;

    if (previousDiscountType !== discountType) {
      const { dispatch, change } = this.props;

      dispatch(change('cost.discountType', discountType));
    }

    return parseFloat(value) || undefined;
  };

  render() {
    const { currencies, order, required, formValues, stripes } = this.props;
    const orderFormat = formValues.orderFormat;
    const isPostPendingOrder = !isWorkflowStatusIsPending(order);

    let validateEresourcesPrices = ATTRS_TO_DISABLE_FIELD;
    let validateEresourcesQuantities = ATTRS_TO_DISABLE_FIELD;
    let validatePhresourcesPrices = ATTRS_TO_DISABLE_FIELD;
    let validatePhresourcesQuantities = ATTRS_TO_DISABLE_FIELD;

    if (ERESOURCES.includes(orderFormat)) {
      validateEresourcesPrices = required ? FIELD_ATTRS_FOR_REQUIRED_PRICE : {};
      validateEresourcesQuantities = required ? FIELD_ATTRS_FOR_REQUIRED_QUANTITY : {};
    }

    if (PHRESOURCES.includes(orderFormat) || orderFormat === OTHER) {
      validatePhresourcesPrices = required ? FIELD_ATTRS_FOR_REQUIRED_PRICE : {};
      validatePhresourcesQuantities = required ? FIELD_ATTRS_FOR_REQUIRED_QUANTITY : {};
    }

    const discountType = get(formValues, 'cost.discountType', DISCOUNT_TYPE.amount) || DISCOUNT_TYPE.amount;
    const isAmountDiscountType = discountType === DISCOUNT_TYPE.amount;
    const poLineEstimatedPrice = calculateEstimatedPrice(formValues, stripes);
    const currency = get(formValues, 'cost.currency');
    const isPackage = get(formValues, 'isPackage');
    const quantityLabel = isPackage ? 'quantity' : 'quantityPhysical';

    return (
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.cost.listPrice" />}
            name="cost.listUnitPrice"
            parse={parseNumberFieldValue}
            type="number"
            disabled={isPostPendingOrder}
            {...validatePhresourcesPrices}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldCurrency
            currencies={currencies}
            disabled={isPostPendingOrder}
            required={required}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id={`ui-orders.cost.${quantityLabel}`} />}
            name="cost.quantityPhysical"
            type="number"
            parse={parseNumber}
            disabled={isPostPendingOrder}
            {...validatePhresourcesQuantities}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.cost.additionalCost" />}
            name="cost.additionalCost"
            parse={parseNumberFieldValue}
            type="number"
            validate={validateNotNegative}
            disabled={isPostPendingOrder}
          />
        </Col>
        {!isPackage && (
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.cost.unitPriceOfElectronic" />}
              name="cost.listUnitPriceElectronic"
              parse={parseNumberFieldValue}
              type="number"
              disabled={isPostPendingOrder}
              {...validateEresourcesPrices}
            />
          </Col>
        )}
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            format={(value) => {
              return !value || isAmountDiscountType
                ? value
                : `${value}%`;
            }}
            fullWidth
            label={<FormattedMessage id="ui-orders.cost.discount" />}
            name="cost.discount"
            normalize={this.normalizeDiscount}
            validate={validateNotNegative}
            disabled={isPostPendingOrder}
          />
        </Col>
        {!isPackage && (
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.cost.quantityElectronic" />}
              name="cost.quantityElectronic"
              type="number"
              parse={parseNumber}
              disabled={isPostPendingOrder}
              {...validateEresourcesQuantities}
            />
          </Col>
        )}
        <Col
          data-test-polineestimatedprice
          xs={6}
          md={3}
        >
          <KeyValue
            label={
              <div>
                <span>
                  <FormattedMessage id="ui-orders.cost.estimatedPrice" />
                </span>
                <InfoPopover
                  buttonLabel={<FormattedMessage id="ui-orders.cost.buttonLabel" />}
                  content={<FormattedMessage id="ui-orders.cost.info" />}
                />
              </div>
            }
          >
            <AmountWithCurrencyField
              currency={currency}
              amount={poLineEstimatedPrice}
            />
          </KeyValue>
        </Col>
      </Row>
    );
  }
}

export default withStripes(CostForm);
