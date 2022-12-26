import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  InfoPopover,
  Row,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import {
  AmountWithCurrencyField,
  ExchangeRateValue,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import { VersionKeyValue } from '../../../../common/VersionView';
import { DISCOUNT_TYPE } from '../../const';
import { RolloverAdjustmentAmount } from '../../Cost/RolloverAdjustmentAmount';

export const CostVersionView = ({ version }) => {
  const stripes = useStripes();

  const orderFormat = version?.orderFormat;
  const isPackage = version?.isPackage;
  const cost = version?.cost;
  const currency = cost?.currency;
  const discount = cost?.discount || 0;

  const isPhysicalValuesVisible = isPackage
    ? orderFormat !== ORDER_FORMATS.electronicResource
    : true;
  const isElectronicValuesVisible = isPackage
    ? (orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix)
    : true;
  const isExchangeRateVisible = stripes.currency !== currency;
  const isPackageLabel = isPackage && orderFormat !== ORDER_FORMATS.PEMix;
  const isPercentageDiscountType = cost?.discountType === DISCOUNT_TYPE.percentage;

  const displayDiscount = isPercentageDiscountType
    ? `${discount}%`
    : (
      <AmountWithCurrencyField
        currency={currency}
        amount={discount}
      />
    );

  return (
    <>
      <Row start="xs">
        {isPhysicalValuesVisible && (
          <>
            <Col
              xs={6}
              lg={3}
            >
              <VersionKeyValue
                name="cost.listUnitPrice"
                label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'listPrice' : 'listPriceOfPhysical'}`} />}
                value={(
                  <AmountWithCurrencyField
                    currency={currency}
                    amount={cost?.listUnitPrice}
                  />
                )}
              />
            </Col>

            <Col
              xs={6}
              lg={3}
            >
              <VersionKeyValue
                name="cost.quantityPhysical"
                label={<FormattedMessage id={`ui-orders.cost.${isPackageLabel ? 'quantity' : 'quantityPhysical'}`} />}
                value={cost?.quantityPhysical}
              />
            </Col>
          </>
        )}
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="cost.currency"
            label={<FormattedMessage id="ui-orders.cost.currency" />}
            value={currency}
          />
        </Col>

        {isExchangeRateVisible && (
          <Col
            xs={6}
            lg={3}
          >
            <ExchangeRateValue
              manualExchangeRate={cost?.exchangeRate}
              exchangeFrom={currency}
              exchangeTo={stripes.currency}
            />
          </Col>
        )}

        {isElectronicValuesVisible && (
          <>
            <Col
              xs={6}
              lg={3}
            >
              <VersionKeyValue
                name="cost.listUnitPriceElectronic"
                label={<FormattedMessage id={`ui-orders.cost.${isPackage ? 'listPrice' : 'unitPriceOfElectronic'}`} />}
                value={(
                  <AmountWithCurrencyField
                    currency={currency}
                    amount={cost?.listUnitPriceElectronic}
                  />
                )}
              />
            </Col>

            <Col
              xs={6}
              lg={3}
            >
              <VersionKeyValue
                name="cost.quantityElectronic"
                label={<FormattedMessage id={`ui-orders.cost.${isPackage ? 'quantity' : 'quantityElectronic'}`} />}
                value={cost?.quantityElectronic}
              />
            </Col>
          </>
        )}

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="cost.additionalCost"
            label={<FormattedMessage id="ui-orders.cost.additionalCost" />}
            value={(
              <AmountWithCurrencyField
                currency={currency}
                amount={cost?.additionalCost}
              />
            )}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="cost.discount"
            label={<FormattedMessage id="ui-orders.cost.discount" />}
            value={displayDiscount}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="cost.poLineEstimatedPrice"
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
            value={(
              <AmountWithCurrencyField
                currency={currency}
                amount={cost?.poLineEstimatedPrice}
              />
            )}
          />
        </Col>

        {
          Boolean(cost?.fyroAdjustmentAmount) && (
            <Col
              xs={6}
              lg={3}
            >
              <RolloverAdjustmentAmount
                name="cost.fyroAdjustmentAmount"
                currency={currency}
                amount={cost?.fyroAdjustmentAmount}
              />
            </Col>
          )
        }
      </Row>
    </>
  );
};

CostVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
