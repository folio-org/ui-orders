import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  FormattedMessage,
} from 'react-intl';
import moment from 'moment';

import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  OrganizationValue,
} from '@folio/stripes-acq-components';

const EresourcesView = ({ line: { eresource }, order, materialTypes }) => {
  const expectedActivation = get(eresource, 'expectedActivation');
  const activationDue = get(eresource, 'activationDue');
  const created = get(order, 'metadata.createdDate', '');
  const activationDueDate = activationDue && moment.utc(created).add(activationDue, 'days').format();
  const accessProviderId = get(eresource, 'accessProvider');
  const materialTypeId = get(eresource, 'materialType');
  const materialType = materialTypes.find((type => materialTypeId === type.id));

  return (
    <Row start="xs">
      <Col xs={3}>
        <OrganizationValue
          id={accessProviderId}
          label={<FormattedMessage id="ui-orders.eresource.accessProvider" />}
        />
      </Col>
      <Col xs={3}>
        <Checkbox
          checked={get(eresource, 'activated')}
          disabled
          label={<FormattedMessage id="ui-orders.eresource.activationStatus" />}
          vertical
        />
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-orders.eresource.activationDue" />}>
          <FolioFormattedDate value={activationDueDate} />
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.eresource.createInventory" />}
          value={get(eresource, 'createInventory')}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.poLine.materialType" />}
          value={get(materialType, 'name', '')}
        />
      </Col>
      <Col xs={3}>
        <Checkbox
          checked={get(eresource, 'trial')}
          disabled
          label={<FormattedMessage id="ui-orders.eresource.trial" />}
          vertical
        />
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-orders.eresource.expectedActivation" />}>
          <FolioFormattedDate value={expectedActivation} />
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.eresource.userLimit" />}
          value={get(eresource, 'userLimit')}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.eresource.url" />}
          value={eresource.resourceUrl}
        />
      </Col>
    </Row>
  );
};

EresourcesView.propTypes = {
  line: PropTypes.shape({
    eresource: PropTypes.object,
  }),
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object,
};

EresourcesView.defaultProps = {
  materialTypes: [],
  line: {
    eresource: {},
  },
  order: {},
};

export default EresourcesView;
