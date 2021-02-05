import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { get } from 'lodash';

import {
  Col,
  InfoPopover,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  CurrencyExchangeRateFields,
  parseNumberFieldValue,
  TextField,
  TypeToggle,
  validateRequiredNotNegative,
  validateRequiredPositiveNumber,
} from '@folio/stripes-acq-components';

import { ifDisabledToChangePaymentInfo } from '../../PurchaseOrder/util';
import parseNumber from '../../Utils/parseNumber';
import {
  ERESOURCE,
  ERESOURCES,
  OTHER,
  PE_MIX,
  PHRESOURCES,
} from '../const';
import calculateEstimatedPrice from '../calculateEstimatedPrice';

const FIELD_ATTRS_FOR_REQUIRED_PRICE = {
  required: true,
  validate: validateRequiredNotNegative,
};
const FIELD_ATTRS_FOR_REQUIRED_QUANTITY = {
  required: true,
  validate: validateRequiredPositiveNumber,
};
const ATTRS_TO_DISABLE_FIELD = {
  disabled: true,
};

const validateNotNegative = (value) => {
  return !value || value > 0
    ? undefined
    : <FormattedMessage id="ui-orders.cost.validation.cantBeNegative" />;
};

const CostForm = ({
  formValues,
  order,
  required,
  initialValues,
}) => {
  const orderFormat = formValues.orderFormat;
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);

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

  const poLineEstimatedPrice = calculateEstimatedPrice(formValues);
  const currency = get(formValues, 'cost.currency');
  const isPackage = get(formValues, 'isPackage');
  const isElectornicFieldsVisible = isPackage ? (orderFormat === ERESOURCE || orderFormat === PE_MIX) : true;
  const isPhysicalFieldsVisible = isPackage ? orderFormat !== ERESOURCE : true;
  const isPackageLabel = isPackage && orderFormat !== PE_MIX;

  return (
    <>
      <Row>
        {isPhysicalFieldsVisible && (
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
              isNonInteractive={isDisabledToChangePaymentInfo}
              {...validatePhresourcesPrices}
            />
          </Col>
        )}
        {isPhysicalFieldsVisible && (
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'quantity' : 'quantityPhysical'}`} />}
              name="cost.quantityPhysical"
              type="number"
              parse={parseNumber}
              isNonInteractive={isDisabledToChangePaymentInfo}
              {...validatePhresourcesQuantities}
            />
          </Col>
        )}
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
            isNonInteractive={isDisabledToChangePaymentInfo}
          />
        </Col>
      </Row>
      <CurrencyExchangeRateFields
        currencyFieldName="cost.currency"
        isCurrencyRequired={required}
        exchangeRateFieldName="cost.exchangeRate"
        initialCurrency={initialValues?.cost.currency}
        isNonInteractive={isDisabledToChangePaymentInfo}
        isTooltipTextExchangeRate={!isDisabledToChangePaymentInfo}
        isUseExangeRateDisabled={isDisabledToChangePaymentInfo}
        exchangeRate={initialValues?.cost?.exchangeRate}
      />
      <Row>
        {isElectornicFieldsVisible && (
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'listPrice' : 'unitPriceOfElectronic'}`} />}
              name="cost.listUnitPriceElectronic"
              parse={parseNumberFieldValue}
              type="number"
              isNonInteractive={isDisabledToChangePaymentInfo}
              {...validateEresourcesPrices}
            />
          </Col>
        )}
        {isElectornicFieldsVisible && (
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'quantity' : 'quantityElectronic'}`} />}
              name="cost.quantityElectronic"
              type="number"
              parse={parseNumber}
              isNonInteractive={isDisabledToChangePaymentInfo}
              {...validateEresourcesQuantities}
            />
          </Col>
        )}
        <Col
          xs={3}
          md={1}
        >
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.cost.discount" />}
            name="cost.discount"
            type="number"
            validate={validateNotNegative}
            isNonInteractive={isDisabledToChangePaymentInfo}
          />
        </Col>
        <Col
          xs={3}
          md={2}
        >
          <Field
            component={TypeToggle}
            currency={currency}
            disabled={isDisabledToChangePaymentInfo}
            label={<FormattedMessage id="ui-orders.cost.discountType" />}
            name="cost.discountType"
          />
        </Col>
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
    </>
  );
};

CostForm.propTypes = {
  formValues: PropTypes.object,
  order: PropTypes.object.isRequired,
  required: PropTypes.bool,
  initialValues: PropTypes.object.isRequired,
};

CostForm.defaultProps = {
  required: true,
};

export default CostForm;
