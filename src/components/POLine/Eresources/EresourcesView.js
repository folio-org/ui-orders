import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';
import moment from 'moment';

import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const EresourcesView = ({ line: { eresource }, order, vendors, materialTypes }) => {
  const expectedActivation = get(eresource, 'expectedActivation');
  const activationDue = get(eresource, 'activationDue');
  const created = get(order, 'metadata.createdDate', '');
  const activationDueDate = activationDue && moment.utc(created).add(activationDue, 'days').format();
  const accessProviderId = get(eresource, 'accessProvider');
  const accessProvider = vendors.find((v => v.id === accessProviderId));
  const materialTypeId = get(eresource, 'materialType');
  const materialType = materialTypes.find((type => materialTypeId === type.id));

  return (
    <Row start="xs">
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.eresource.accessProvider" />}
          value={get(accessProvider, 'name', '')}
        />
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-orders.eresource.activationStatus" />}>
          <Checkbox checked={get(eresource, 'activated')} disabled />
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-orders.eresource.activationDue" />}>
          {activationDueDate && <FormattedDate value={activationDueDate} />}
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
        <KeyValue label={<FormattedMessage id="ui-orders.eresource.trial" />}>
          <Checkbox checked={get(eresource, 'trial')} disabled />
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-orders.eresource.expectedActivation" />}>
          {expectedActivation && <FormattedDate value={expectedActivation} />}
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.eresource.userLimit" />}
          value={get(eresource, 'userLimit')}
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
  vendors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

EresourcesView.defaultProps = {
  materialTypes: [],
  line: {
    eresource: {},
  },
  order: {},
};

export default EresourcesView;
