import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import {
  Col,
  InfoPopover,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  ExchangeRateValue,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import {
  DISCOUNT_TYPE,
} from '../const';
import {
  isEresource,
  isPhresource,
} from '../../../common/POLFields';
import {
  RolloverAdjustmentAmount,
} from './RolloverAdjustmentAmount';

function CostView({ cost, isPackage, orderFormat }) {
  const stripes = useStripes();
  const discountType = cost.discountType;
  const discount = cost.discount || 0;
  const currency = cost.currency;
  const isPercentageDiscountType = discountType === DISCOUNT_TYPE.percentage;
  const displayDiscount = isPercentageDiscountType
    ? `${discount}%`
    : (
      <AmountWithCurrencyField
        currency={currency}
        amount={discount}
      />
    );
  const isIncludePhysical = isPhresource(orderFormat);
  const isIncludeElectronic = isEresource(orderFormat);
  const isElectronicValuesVisible = isPackage ? isIncludeElectronic : true;
  const isPhysicalValuesVisible = isPackage ? isIncludePhysical : true;
  const isExchangeRateVisible = stripes.currency !== currency;
  const isPackageLabel = isPackage && orderFormat !== ORDER_FORMATS.PEMix;

  return (
    <Row start="xs">
      {isPhysicalValuesVisible && (
        <Col
          data-col-cost-list-unit-price
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'listPrice' : 'listPriceOfPhysical'}`} />}>
            <AmountWithCurrencyField
              currency={currency}
              amount={cost.listUnitPrice}
            />
          </KeyValue>
        </Col>
      )}
      {isPhysicalValuesVisible && (
        <Col
          data-col-cost-qty-physical
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'quantity' : 'quantityPhysical'}`} />}
            value={isIncludePhysical ? (cost.quantityPhysical ?? 0) : null}
          />
        </Col>
      )}
      <Col
        data-col-cost-currency
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.cost.currency" />}
          value={currency}
        />
      </Col>
      {isExchangeRateVisible && (
        <Col
          data-col-cost-exchange-rate
          xs={6}
          lg={3}
        >
          <ExchangeRateValue
            manualExchangeRate={cost.exchangeRate}
            exchangeFrom={currency}
            exchangeTo={stripes.currency}
          />
        </Col>
      )}
      {isElectronicValuesVisible && (
        <Col
          data-col-cost-qty-unit-price-electronic
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-orders.cost.${isPackage ? 'listPrice' : 'unitPriceOfElectronic'}`} />}
          >
            <AmountWithCurrencyField
              currency={currency}
              amount={cost.listUnitPriceElectronic}
            />
          </KeyValue>
        </Col>
      )}
      {isElectronicValuesVisible && (
        <Col
          data-col-cost-qty-electronic
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id={`ui-orders.cost.${isPackage ? 'quantity' : 'quantityElectronic'}`} />}
            value={isIncludeElectronic ? (cost.quantityElectronic ?? 0) : null}
          />
        </Col>
      )}
      <Col
        data-col-cost-addition-cost
        xs={6}
        lg={3}
      >
        <KeyValue label={<FormattedMessage id="ui-orders.cost.additionalCost" />}>
          <AmountWithCurrencyField
            currency={currency}
            amount={cost.additionalCost}
          />
        </KeyValue>
      </Col>
      <Col
        data-col-cost-discount
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.cost.discount" />}
          value={displayDiscount}
        />
      </Col>
      <Col
        data-col-cost-estimated-price
        xs={6}
        lg={3}
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
            amount={cost.poLineEstimatedPrice}
          />
        </KeyValue>
      </Col>

      {
        Boolean(cost.fyroAdjustmentAmount) && (
          <Col
            data-col-cost-estimated-price
            xs={6}
            lg={3}
          >
            <RolloverAdjustmentAmount
              currency={currency}
              amount={cost.fyroAdjustmentAmount}
            />
          </Col>
        )
      }
    </Row>
  );
}

CostView.propTypes = {
  cost: PropTypes.object,
  isPackage: PropTypes.bool,
  orderFormat: PropTypes.string,
};

CostView.defaultProps = {
  cost: {},
  isPackage: false,
};

export default CostView;
