import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Grid,
  KeyValue,
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
        return 'true';
      } else if (value === false) {
        return 'false';
      }

      return value ?? <NoValue />;
  }
}

const ComponentToPrint = ({ dataSource = {} }) => {
  return (
    <div>
      <Grid>
        <Row>
          <Col xs={6}>Lib name</Col>
          <Col xs={6}>
            <div>Purchase order</div>
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
            <div>Bill to address:</div>
            <div>{dataSource.billToAddress}</div>
          </Col>
          <Col xs={6}>
            <div>Date ordered: <FolioFormattedTime dateString={dataSource.dateOrdered} /></div>
            <div>PO#: {dataSource.poNumber}</div>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div>Vendor: {dataSource.vendor?.name}</div>
            <div>Primary address: {dataSource.vendorPrimaryAddress?.addressLine1}</div>
            <div>Phone: {dataSource.vendorPrimaryPhone?.phoneNumber}</div>
          </Col>
          <Col xs={6}>
            <div>Ship to:</div>
            <div>{dataSource.shipToAddress}</div>
          </Col>
        </Row>

      </Grid>
      <Row className={css.space}>------------------------------------</Row>

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
          <div>Total items: {dataSource.totalItems}</div>
          <div>Total: <AmountWithCurrencyField amount={dataSource.totalEstimatedPrice} /></div>
        </Col>
      </Row>
    </div>
  );
};

ComponentToPrint.propTypes = {
  dataSource: PropTypes.object,
};

export default ComponentToPrint;
