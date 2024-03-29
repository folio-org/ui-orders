import React, { useCallback } from 'react';
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
  IfFieldVisible,
  ORDER_FORMATS,
  TextField,
  TypeToggle,
  VisibilityControl,
  validateRequiredNotNegative,
  validateRequiredPositiveNumber,
} from '@folio/stripes-acq-components';

import {
  ifDisabledToChangePaymentInfo,
  isWorkflowStatusOpen,
} from '../../PurchaseOrder/util';
import parseNumber from '../../Utils/parseNumber';
import {
  ERESOURCES,
  PHRESOURCES,
} from '../const';
import { CalculatedExchangeAmount } from '../CalculatedExchangeAmount';
import calculateEstimatedPrice from '../calculateEstimatedPrice';
import {
  RolloverAdjustmentAmount,
} from './RolloverAdjustmentAmount';

import styles from './CostForm.css';

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
  initialValues,
  change,
  required,
  hiddenFields,
}) => {
  const orderFormat = formValues.orderFormat;
  const checkinItems = formValues.checkinItems;
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
  const rolloverAdjustmentAmount = formValues.cost?.fyroAdjustmentAmount;

  let validateEresourcesPrices = ATTRS_TO_DISABLE_FIELD;
  let validateEresourcesQuantities = ATTRS_TO_DISABLE_FIELD;
  let validatePhresourcesPrices = ATTRS_TO_DISABLE_FIELD;
  let validatePhresourcesQuantities = ATTRS_TO_DISABLE_FIELD;

  if (ERESOURCES.includes(orderFormat)) {
    validateEresourcesPrices = required ? FIELD_ATTRS_FOR_REQUIRED_PRICE : {};
    validateEresourcesQuantities = required ? FIELD_ATTRS_FOR_REQUIRED_QUANTITY : {};
  }

  if (PHRESOURCES.includes(orderFormat) || orderFormat === ORDER_FORMATS.other) {
    validatePhresourcesPrices = required ? FIELD_ATTRS_FOR_REQUIRED_PRICE : {};
    validatePhresourcesQuantities = required ? FIELD_ATTRS_FOR_REQUIRED_QUANTITY : {};
  }

  const poLineEstimatedPrice = calculateEstimatedPrice(formValues);
  const currency = get(formValues, 'cost.currency');
  const exchangeRate = get(formValues, 'cost.exchangeRate');
  const isPackage = get(formValues, 'isPackage');
  const isElectronicFieldsVisible = isPackage
    ? (orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix)
    : true;
  const isPhysicalFieldsVisible = isPackage ? orderFormat !== ORDER_FORMATS.electronicResource : true;
  const isPackageLabel = isPackage && orderFormat !== ORDER_FORMATS.PEMix;
  const isQuantityDisabled = !(checkinItems || isPackage) && isWorkflowStatusOpen(order);

  if (isQuantityDisabled) {
    validatePhresourcesQuantities = ATTRS_TO_DISABLE_FIELD;
    validateEresourcesQuantities = ATTRS_TO_DISABLE_FIELD;
  }

  const getQuantityLabel = useCallback((labelId) => (
    <div>
      <span>
        <FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'quantity' : labelId}`} />
      </span>
      {isQuantityDisabled && (
        <InfoPopover
          content={<FormattedMessage id="ui-orders.cost.quantityPopover" />}
        />
      )}
    </div>
  ), [isPackageLabel, isQuantityDisabled]);

  const onCostChange = e => {
    if (rolloverAdjustmentAmount) {
      change('cost.fyroAdjustmentAmount', 0);
    }

    change(e.target.name, parseNumber(e.target.value));
  };

  return (
    <>
      <Row>
        {isPhysicalFieldsVisible && (
          <>
            <IfFieldVisible visible={!hiddenFields.cost?.listUnitPrice} name="cost.listUnitPrice">
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.cost.listUnitPrice">
                  <Field
                    component={TextField}
                    onChange={onCostChange}
                    fullWidth
                    label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'listPrice' : 'listPriceOfPhysical'}`} />}
                    name="cost.listUnitPrice"
                    type="number"
                    isNonInteractive={isDisabledToChangePaymentInfo}
                    {...validatePhresourcesPrices}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.cost?.quantityPhysical} name="cost.quantityPhysical">
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.cost.quantityPhysical">
                  <Field
                    component={TextField}
                    fullWidth
                    label={getQuantityLabel('quantityPhysical')}
                    name="cost.quantityPhysical"
                    type="number"
                    parse={parseNumber}
                    isNonInteractive={isDisabledToChangePaymentInfo}
                    {...validatePhresourcesQuantities}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>
          </>
        )}

        <IfFieldVisible visible={!hiddenFields.cost?.additionalCost} name="cost.additionalCost">
          <Col
            xs={6}
            md={3}
          >
            <VisibilityControl name="hiddenFields.cost.additionalCost">
              <Field
                component={TextField}
                onChange={onCostChange}
                fullWidth
                label={<FormattedMessage id="ui-orders.cost.additionalCost" />}
                name="cost.additionalCost"
                type="number"
                validate={validateNotNegative}
                isNonInteractive={isDisabledToChangePaymentInfo}
              />
            </VisibilityControl>
          </Col>
        </IfFieldVisible>

        {
          Boolean(initialValues?.cost?.fyroAdjustmentAmount) && (
            <Col
              xs={6}
              md={3}
            >
              <RolloverAdjustmentAmount
                currency={currency}
                amount={rolloverAdjustmentAmount}
              />
            </Col>
          )
        }
      </Row>

      <CurrencyExchangeRateFields
        currencyFieldName="cost.currency"
        isCurrencyRequired={required}
        exchangeRateFieldName="cost.exchangeRate"
        initialCurrency={initialValues?.cost?.currency}
        isNonInteractive={isDisabledToChangePaymentInfo}
        isTooltipTextExchangeRate={!isDisabledToChangePaymentInfo}
        isUseExangeRateDisabled={isDisabledToChangePaymentInfo}
        exchangeRate={initialValues?.cost?.exchangeRate}
        hiddenFields={hiddenFields}
      />

      <CalculatedExchangeAmount
        currency={currency}
        exchangeRate={exchangeRate}
        total={poLineEstimatedPrice}
      />

      <Row>
        {isElectronicFieldsVisible && (
          <>
            <IfFieldVisible visible={!hiddenFields.cost?.listUnitPriceElectronic} name="cost.listUnitPriceElectronic">
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.cost.listUnitPriceElectronic">
                  <Field
                    component={TextField}
                    onChange={onCostChange}
                    fullWidth
                    label={<FormattedMessage id={`ui-orders.cost.${isPackage ? 'listPrice' : 'unitPriceOfElectronic'}`} />}
                    name="cost.listUnitPriceElectronic"
                    type="number"
                    isNonInteractive={isDisabledToChangePaymentInfo}
                    {...validateEresourcesPrices}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.cost?.quantityElectronic} name="cost.quantityElectronic">
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.cost.quantityElectronic">
                  <Field
                    component={TextField}
                    fullWidth
                    label={getQuantityLabel('quantityElectronic')}
                    name="cost.quantityElectronic"
                    type="number"
                    parse={parseNumber}
                    isNonInteractive={isDisabledToChangePaymentInfo}
                    {...validateEresourcesQuantities}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>
          </>
        )}

        <IfFieldVisible visible={!hiddenFields.cost?.discount} name="cost.discount">
          <Col
            xs={3}
            md={2}
          >
            <VisibilityControl name="hiddenFields.cost.discount">
              <Field
                component={TextField}
                fullWidth
                label={<FormattedMessage id="ui-orders.cost.discount" />}
                name="cost.discount"
                type="number"
                parse={parseNumber}
                validate={validateNotNegative}
                isNonInteractive={isDisabledToChangePaymentInfo}
              />
            </VisibilityControl>
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.cost?.discountType} name="cost.discountType">
          <Col
            xs={3}
            md={2}
          >
            <VisibilityControl name="hiddenFields.cost.discountType">
              <div className={styles.costDiscountTypeWrapper}>
                <Field
                  component={TypeToggle}
                  currency={currency}
                  disabled={isDisabledToChangePaymentInfo}
                  label={<FormattedMessage id="ui-orders.cost.discountType" />}
                  name="cost.discountType"
                />
              </div>
            </VisibilityControl>
          </Col>
        </IfFieldVisible>

        <Col
          data-test-polineestimatedprice
          xs={6}
          md={2}
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
  change: PropTypes.func,
  hiddenFields: PropTypes.object,
};

CostForm.defaultProps = {
  hiddenFields: {},
  required: true,
};

export default CostForm;
