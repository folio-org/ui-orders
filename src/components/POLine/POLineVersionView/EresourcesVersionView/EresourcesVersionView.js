import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  TextLink,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import {
  VersionCheckbox,
  VersionKeyValue,
} from '../../../../common/VersionView';

export const EresourcesVersionView = ({ version }) => {
  const eresource = version?.eresource;
  const created = version?.order?.metadata?.createdDate;

  const activationDueDate = eresource?.activationDue && moment.utc(created).add(eresource.activationDue, 'days').format();
  const resourceUrl = eresource?.resourceUrl && (
    <TextLink
      href={eresource?.resourceUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      {eresource?.resourceUrl}
    </TextLink>
  );

  return (
    <Row start="xs">
      <Col xs={3}>
        <VersionKeyValue
          name="eresource.accessProvider"
          label={<FormattedMessage id="ui-orders.eresource.accessProvider" />}
          value={eresource?.accessProvider}
        />
      </Col>

      <Col xs={3}>
        <VersionCheckbox
          name="eresource.activationStatus"
          checked={eresource?.activated}
          label={<FormattedMessage id="ui-orders.eresource.activationStatus" />}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="eresource.activationDue"
          label={<FormattedMessage id="ui-orders.eresource.activationDue" />}
          value={<FolioFormattedDate value={activationDueDate} />}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="eresource.createInventory"
          label={<FormattedMessage id="ui-orders.eresource.createInventory" />}
          value={eresource?.createInventory}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="eresource.materialType"
          label={<FormattedMessage id="ui-orders.poLine.materialType" />}
          value={eresource?.materialType}
        />
      </Col>

      <Col xs={3}>
        <VersionCheckbox
          name="eresource.trial"
          checked={eresource?.trial}
          label={<FormattedMessage id="ui-orders.eresource.trial" />}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="eresource.expectedActivation"
          label={<FormattedMessage id="ui-orders.eresource.expectedActivation" />}
          value={<FolioFormattedDate value={eresource?.expectedActivation} />}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="eresource.userLimit"
          label={<FormattedMessage id="ui-orders.eresource.userLimit" />}
          value={eresource?.userLimit}
        />
      </Col>

      <Col xs={3}>
        <VersionKeyValue
          name="eresource.url"
          label={<FormattedMessage id="ui-orders.eresource.url" />}
          value={resourceUrl}
        />
      </Col>
    </Row>
  );
};

EresourcesVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
