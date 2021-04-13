import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage, IntlProvider, useIntl } from 'react-intl';

import {
  Col,
  Grid,
  KeyValue,
  Label,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedTime,
  ORDER_STATUS_LABEL,
} from '@folio/stripes-acq-components';

import {
  DISCOUNT_TYPE,
} from '../../components/POLine/const';
import { LINE_FIELDS_MAP, LINE_FIELDS_LABELS } from './constants';
import css from './ComponentToPrint.css';

function PrintValue({ path, source, exportedLine }) {
  const value = get(exportedLine, path, null) || get(source, path, null);
  const currency = get(source, LINE_FIELDS_MAP.currency);

  switch (path) {
    case LINE_FIELDS_MAP.listUnitPrice:
    case LINE_FIELDS_MAP.listUnitPriceElectronic:
    case LINE_FIELDS_MAP.additionalCost:
    case LINE_FIELDS_MAP.poLineEstimatedPrice:
      return (
        <AmountWithCurrencyField
          currency={currency}
          amount={value}
        />
      );
    case LINE_FIELDS_MAP.discount:
      if (!value) return <NoValue />;

      return get(source, 'cost.discountType') === DISCOUNT_TYPE.percentage
        ? `${value}%`
        : (
          <AmountWithCurrencyField
            currency={currency}
            amount={value}
          />
        );
    default:
      if (value === true) {
        return <FormattedMessage id="ui-orders.filter.true" />;
      } else if (value === false) {
        return <FormattedMessage id="ui-orders.filter.false" />;
      }

      return value ?? <NoValue />;
  }
}

const ComponentToPrint = ({ dataSource = {} }) => {
  const intl = useIntl();

  return (
    <IntlProvider
      defaultLocale="en"
      messages={intl.messages}
      timeZone={intl.timeZone}
      currency={intl.currency}
    >
      <Grid>
        <Row>
          <Col xs={6}>
            <Label>
              <FormattedMessage id="ui-orders.print.po" />
            </Label>
          </Col>
          <Col xs={6}>
            <div>
              <FormattedMessage id="ui-orders.orderSummary.workflowStatus" />:&nbsp;
              {dataSource.workflowStatus ? ORDER_STATUS_LABEL[dataSource.workflowStatus] : <NoValue />}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div>
              <FormattedMessage id="ui-orders.orderSummary.closingReason" />:&nbsp;
              {dataSource.closeReason?.reason || <NoValue />}
            </div>
            <div><FormattedMessage id="ui-orders.print.billToAddress" />:</div>
            <div>{dataSource.billToAddress}</div>
          </Col>
          <Col xs={6}>
            <div>
              <FormattedMessage id="ui-orders.dateOrdered" />:&nbsp;
              <FolioFormattedTime dateString={dataSource.dateOrdered} />
            </div>
            <div>
              <FormattedMessage id="ui-orders.print.poNumber" />:&nbsp;
              {dataSource.poNumber}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div>
              <FormattedMessage id="ui-orders.print.vendor" />:&nbsp;
              {dataSource.vendor?.name}
            </div>
            <div>
              <FormattedMessage id="ui-orders.print.vendorPrimaryAddress" />:&nbsp;
              {dataSource.vendorPrimaryAddress?.addressLine1}
            </div>
            <div>
              <FormattedMessage id="ui-orders.print.vendorPhone" />:&nbsp;
              {dataSource.vendorPrimaryPhone?.phoneNumber}
            </div>
          </Col>
          <Col xs={6}>
            <div><FormattedMessage id="ui-orders.print.shipToAddress" />:</div>
            <div>{dataSource.shipToAddress}</div>
          </Col>
        </Row>

      </Grid>

      {dataSource.compositePoLines?.map((line, i) => {
        return (
          <div key={line.id}>
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP.poLineNumber]}
                >
                  {line.poLineNumber}
                </KeyValue>
              </Col>
            </Row>
            <Row className={css.colB}>
              {Object.keys(LINE_FIELDS_MAP).map((col) => {
                if (col === LINE_FIELDS_MAP.poLineNumber) return null;

                return (
                  <Col xs={3} key={col}>
                    <KeyValue
                      label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                    >
                      <PrintValue path={LINE_FIELDS_MAP[col]} source={line} exportedLine={dataSource.exportData[i]} />
                    </KeyValue>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}

      <Row>
        <Col xs={6}>
          {LINE_FIELDS_LABELS['vendorDetail.instructions']}: {
            dataSource.compositePoLines?.map((line) => {
              return (
                <span key={line.id}>
                  {line.vendorDetail?.instructions}
                </span>
              );
            })
          }
        </Col>
        <Col xs={6}>
          <div>
            <FormattedMessage id="ui-orders.print.totalItems" />:&nbsp;
            {dataSource.totalItems}
          </div>
          <div>
            <FormattedMessage id="ui-orders.print.total" />:&nbsp;
            <AmountWithCurrencyField amount={dataSource.totalEstimatedPrice} />
          </div>
        </Col>
      </Row>
    </IntlProvider>
  );
};

ComponentToPrint.propTypes = {
  dataSource: PropTypes.object,
};

export default ComponentToPrint;
