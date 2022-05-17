import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';
import { get } from 'lodash';

import { ClipCopy } from '@folio/stripes/smart-components';
import {
  Checkbox,
  Col,
  KeyValue,
  Loading,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  FolioFormattedTime,
  sourceLabels,
} from '@folio/stripes-acq-components';

import { useAcqMethods } from '../../../common/hooks';
import { IfVisible } from '../../../common/IfVisible';
import { getTranslatedAcqMethod } from '../../Utils/getTranslatedAcqMethod';

const invalidAcqMethod = <FormattedMessage id="ui-orders.acquisitionMethod.invalid" />;

const POLineDetails = ({ line, hiddenFields }) => {
  const receiptDate = get(line, 'receiptDate');
  const { acqMethods, isLoading } = useAcqMethods(line.acquisitionMethod);

  const translatedAcqMethod = (!isLoading && acqMethods[0])
    ? getTranslatedAcqMethod(acqMethods[0].value)
    : invalidAcqMethod;

  return (
    <>
      <Row start="xs">
        <Col
          data-col-line-details-number
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.number" />}>
            {line?.poLineNumber
              ? (
                <>
                  {line.poLineNumber}
                  <ClipCopy text={line.poLineNumber} />
                </>
              )
              : <NoValue />
            }
          </KeyValue>
        </Col>
        <IfVisible visible={!hiddenFields.acquisitionMethod}>
          <Col
            data-col-line-details-acq-method
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
              value={isLoading ? <Loading /> : translatedAcqMethod}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.automaticExport}>
          <Col
            data-col-line-details-auto-export
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={line.automaticExport}
              disabled
              label={<FormattedMessage id="ui-orders.poLine.automaticExport" />}
              vertical
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.orderFormat}>
          <Col
            data-col-line-details-order-format
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
              value={get(line, 'orderFormat')}
            />
          </Col>
        </IfVisible>

        <Col
          data-col-line-details-created-on
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.createdOn" />}>
            <FolioFormattedTime dateString={get(line, 'metadata.createdDate')} />
          </KeyValue>
        </Col>

        <IfVisible visible={!hiddenFields.receiptDate}>
          <Col
            data-col-line-details-receipt-date
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}>
              <FolioFormattedDate value={receiptDate} utc={false} />
            </KeyValue>
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.receiptStatus}>
          <Col
            data-col-line-details-receipt-status
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.receiptStatus" />}
              value={get(line, 'receiptStatus')}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.paymentStatus}>
          <Col
            data-col-line-details-payment-status
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.paymentStatus" />}
              value={get(line, 'paymentStatus')}
            />
          </Col>
        </IfVisible>

        <Col
          data-col-line-details-source
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.source" />}
            value={sourceLabels[line.source]}
          />
        </Col>

        <IfVisible visible={!hiddenFields.donor}>
          <Col
            data-col-line-details-donor
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.donor" />}
              value={get(line, 'donor')}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.selector}>
          <Col
            data-col-line-details-selector
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.selector" />}
              value={get(line, 'selector')}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.requester}>
          <Col
            data-col-line-details-requestor
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.requester" />}
              value={get(line, 'requester')}
            />
          </Col>
        </IfVisible>
      </Row>
      <Row start="xs">
        <IfVisible visible={!hiddenFields.cancellationRestriction}>
          <Col
            data-col-line-details-cancellation-restriction
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={get(line, 'cancellationRestriction')}
              disabled
              label={<FormattedMessage id="ui-orders.poLine.cancellationRestriction" />}
              vertical
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.rush}>
          <Col
            data-col-line-details-rush
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={get(line, 'rush')}
              disabled
              label={<FormattedMessage id="ui-orders.poLine.rush" />}
              vertical
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.collection}>
          <Col
            data-col-line-details-collection
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={get(line, 'collection')}
              disabled
              label={<FormattedMessage id="ui-orders.poLine.сollection" />}
              vertical
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.checkinItems}>
          <Col
            data-col-line-details-checkin-items
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.receivingWorkflow" />}
              value={<FormattedMessage id={`ui-orders.poLine.receivingWorkflow.${line.checkinItems ? 'independent' : 'synchronized'}`} />}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.cancellationRestrictionNote}>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.cancellationRestrictionNote" />}
              value={get(line, 'cancellationRestrictionNote')}
            />
          </Col>
        </IfVisible>

        <IfVisible visible={!hiddenFields.poLineDescription}>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.poLineDescription" />}
              value={get(line, 'poLineDescription')}
            />
          </Col>
        </IfVisible>
      </Row>
    </>
  );
};

POLineDetails.propTypes = {
  line: PropTypes.object,
  hiddenFields: PropTypes.object,
};

POLineDetails.defaultProps = {
  line: {},
  hiddenFields: {},
};

export default POLineDetails;
