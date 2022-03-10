import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Grid,
  KeyValue,
  Label,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedTime,
  KeyValueInline,
  ORDER_STATUS_LABEL,
} from '@folio/stripes-acq-components';

import { buildAddressString } from '../utils';
import { PrintOrderLines } from './PrintOrderLines';

const ComponentToPrint = ({ dataSource = {} }) => {
  return (
    <>
      <Grid>
        <Row>
          <Col xs={6}>
            <Label>
              <FormattedMessage id="ui-orders.print.po" />
            </Label>
          </Col>
          <Col xs={6}>
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
              value={ORDER_STATUS_LABEL[dataSource.workflowStatus]}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.vendor" />}
              value={dataSource.vendor?.name}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.vendorPrimaryAddress" />}
              value={buildAddressString(dataSource.vendorPrimaryAddress)}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.vendorPhone" />}
              value={dataSource.vendorPrimaryPhone?.phoneNumber}
            />
            <KeyValue
              label={<FormattedMessage id="ui-orders.print.billToAddress" />}
              value={dataSource.billToAddress}
            />
          </Col>
          <Col xs={6}>
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.dateOpened" />}
              value={<FolioFormattedTime dateString={dataSource.dateOrdered} />}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.poNumber" />}
              value={dataSource.poNumber}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.orderSummary.closingReason" />}
              value={dataSource.closeReason?.reason}
            />
            <KeyValue
              label={<FormattedMessage id="ui-orders.print.shipToAddress" />}
              value={dataSource.shipToAddress}
            />
          </Col>
        </Row>
      </Grid>

      <PrintOrderLines lines={dataSource.lines} />

      <Row>
        <Col xs={12}>
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.print.totalItems" />}
            value={dataSource.totalItems}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.print.total" />}
            value={<AmountWithCurrencyField amount={dataSource.totalEstimatedPrice} />}
          />
        </Col>
      </Row>
    </>
  );
};

ComponentToPrint.propTypes = {
  dataSource: PropTypes.object,
};

export default ComponentToPrint;
