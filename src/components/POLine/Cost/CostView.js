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

import { IfVisible } from '../../../common/IfVisible';
import { DISCOUNT_TYPE } from '../const';
import { RolloverAdjustmentAmount } from './RolloverAdjustmentAmount';

function CostView({ cost, isPackage, orderFormat, hiddenFields }) {
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
  const isElectronicValuesVisible = isPackage
    ? (orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix)
    : true;
  const isPhysicalValuesVisible = isPackage ? orderFormat !== ORDER_FORMATS.electronicResource : true;
  const isExchangeRateVisible = stripes.currency !== currency;
  const isPackageLabel = isPackage && orderFormat !== ORDER_FORMATS.PEMix;

  return (
    <Row start="xs">
      {isPhysicalValuesVisible && (
        <IfVisible visible={!hiddenFields.cost?.listUnitPrice}>
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
        </IfVisible>
      )}
      {isPhysicalValuesVisible && (
        <IfVisible visible={!hiddenFields.cost?.quantityPhysical}>
          <Col
            data-col-cost-qty-physical
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'quantity' : 'quantityPhysical'}`} />}
              value={cost.quantityPhysical}
            />
          </Col>
        </IfVisible>
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
        <IfVisible visible={!hiddenFields.cost?.listUnitPriceElectronic}>
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
        </IfVisible>
      )}
      {isElectronicValuesVisible && (
        <IfVisible visible={!hiddenFields.cost?.quantityElectronic}>
          <Col
            data-col-cost-qty-electronic
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id={`ui-orders.cost.${isPackage ? 'quantity' : 'quantityElectronic'}`} />}
              value={cost.quantityElectronic}
            />
          </Col>
        </IfVisible>
      )}

      <IfVisible visible={!hiddenFields.cost?.additionalCost}>
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
      </IfVisible>

      <IfVisible visible={!hiddenFields.cost?.discount}>
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
      </IfVisible>

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
  hiddenFields: PropTypes.object,
};

CostView.defaultProps = {
  cost: {},
  isPackage: false,
  hiddenFields: {},
};

export default CostView;
