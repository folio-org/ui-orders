import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isNil } from 'lodash';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  FolioFormattedTime,
  sourceLabels,
} from '@folio/stripes-acq-components';

import {
  VersionCheckbox,
  VersionKeyValue,
} from '../../../../common/VersionView';

export const POLineDetailsVersionView = ({ version }) => {
  return (
    <>
      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="poLineNumber"
            label={<FormattedMessage id="ui-orders.poLine.number" />}
            value={version?.poLineNumber}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="acquisitionMethod"
            label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
            value={version?.acquisitionMethod}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="automaticExport"
            checked={version?.automaticExport}
            label={<FormattedMessage id="ui-orders.poLine.automaticExport" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="orderFormat"
            label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
            value={version?.orderFormat}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="metadata.createdDate"
            label={<FormattedMessage id="ui-orders.poLine.createdOn" />}
            value={<FolioFormattedTime dateString={version?.metadata?.createdDate} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="receiptDate"
            label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}
            value={<FolioFormattedDate value={version?.receiptDate} utc={false} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="receiptStatus"
            label={<FormattedMessage id="ui-orders.poLine.receiptStatus" />}
            value={version?.receiptStatus}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="paymentStatus"
            label={<FormattedMessage id="ui-orders.poLine.paymentStatus" />}
            value={version?.paymentStatus}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="source"
            label={<FormattedMessage id="ui-orders.poLine.source" />}
            value={sourceLabels[version?.source]}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="donor"
            label={<FormattedMessage id="ui-orders.poLine.donor" />}
            value={version?.donor}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="selector"
            label={<FormattedMessage id="ui-orders.poLine.selector" />}
            value={version?.selector}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="requester"
            label={<FormattedMessage id="ui-orders.poLine.requester" />}
            value={version?.requester}
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="cancellationRestriction"
            checked={version?.cancellationRestriction}
            label={<FormattedMessage id="ui-orders.poLine.cancellationRestriction" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name=""
            checked={version?.rush}
            label={<FormattedMessage id="ui-orders.poLine.rush" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="collection"
            checked={version?.collection}
            label={<FormattedMessage id="ui-orders.poLine.сollection" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="checkinItems"
            label={<FormattedMessage id="ui-orders.poLine.receivingWorkflow" />}
            value={(
              !isNil(version?.checkinItems) && <FormattedMessage id={`ui-orders.poLine.receivingWorkflow.${version.checkinItems ? 'independent' : 'synchronized'}`} />
            )}
          />
        </Col>

        <Col xs={12}>
          <VersionKeyValue
            name="cancellationRestrictionNote"
            label={<FormattedMessage id="ui-orders.poLine.cancellationRestrictionNote" />}
            value={version?.cancellationRestrictionNote}
          />
        </Col>

        <Col xs={12}>
          <VersionKeyValue
            name="poLineDescription"
            label={<FormattedMessage id="ui-orders.poLine.poLineDescription" />}
            value={version?.poLineDescription}
          />
        </Col>
      </Row>
    </>
  );
};

POLineDetailsVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
