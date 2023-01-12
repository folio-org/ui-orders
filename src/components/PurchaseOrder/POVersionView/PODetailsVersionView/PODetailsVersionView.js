import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import {
  VersionCheckbox,
  VersionKeyValue,
} from '../../../../common/VersionView';
import { isWorkflowStatusOpen } from '../../util';

export const PODetailsVersionView = ({ version }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          {version?.metadata && <ViewMetaData metadata={version.metadata} />}
        </Col>
      </Row>
      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="poNumber"
            label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
            value={version?.poNumber}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="vendor"
            label={<FormattedMessage id="ui-orders.orderDetails.vendor" />}
            value={version?.vendor}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="orderType"
            label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
            value={version?.orderType}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="acqUnitIds"
            label={<FormattedMessage id="stripes-acq-components.label.acqUnits" />}
            value={version?.acqUnits}
            multiple
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="approvalDate"
            label={<FormattedMessage id="ui-orders.orderDetails.approvalDate" />}
            value={version?.approvalDate}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="assignedTo"
            label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
            value={version?.assignedTo}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="billTo"
            label={<FormattedMessage id="ui-orders.orderDetails.billTo" />}
            value={version?.billTo}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="shipTo"
            label={<FormattedMessage id="ui-orders.orderDetails.shipTo" />}
            value={version?.shipTo}
          />
        </Col>
      </Row>

      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="manualPO"
            label={<FormattedMessage id="ui-orders.orderDetails.manualPO" />}
            checked={version?.manualPO}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="reEncumber"
            label={<FormattedMessage id="ui-orders.orderDetails.reEncumber" />}
            checked={version?.reEncumber}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="metadata.createdByUserId"
            label={<FormattedMessage id="ui-orders.orderDetails.createdBy" />}
            value={version?.createdByUser}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="metadata.createdDate"
            label={<FormattedMessage id="ui-orders.orderDetails.createdOn" />}
            value={<FolioFormattedTime dateString={version?.metadata?.createdDate} />}
          />
        </Col>

        {isWorkflowStatusOpen(version) && (
          <Col
            xs={6}
            lg={3}
          >
            <VersionKeyValue
              name="dateOrdered"
              label={<FormattedMessage id="ui-orders.orderDetails.dateOpened" />}
              value={<FolioFormattedTime dateString={version?.dateOrdered} />}
            />
          </Col>
        )}

        <Col xs={12}>
          {version?.notes?.map((note, index) => (
            <VersionKeyValue
              key={note}
              name={`notes[${index}]`}
              label={<FormattedMessage id="ui-orders.orderDetails.note" />}
              value={note}
            />
          ))}
        </Col>
      </Row>
    </>
  );
};

PODetailsVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
