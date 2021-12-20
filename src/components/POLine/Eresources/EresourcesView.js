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
  TextLink,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  OrganizationValue,
} from '@folio/stripes-acq-components';

import { IfVisible } from '../../../common/IfVisible';

const EresourcesView = ({ line: { eresource }, order, materialTypes, hiddenFields }) => {
  const expectedActivation = get(eresource, 'expectedActivation');
  const activationDue = get(eresource, 'activationDue');
  const created = get(order, 'metadata.createdDate', '');
  const activationDueDate = activationDue && moment.utc(created).add(activationDue, 'days').format();
  const accessProviderId = get(eresource, 'accessProvider');
  const materialTypeId = get(eresource, 'materialType');
  const materialType = materialTypes.find((type => materialTypeId === type.id));

  const resourceUrl = eresource?.resourceUrl && (
    <TextLink
      href={eresource.resourceUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      {eresource.resourceUrl}
    </TextLink>
  );

  return (
    <Row start="xs">
      <IfVisible visible={!hiddenFields.eresource?.accessProvider}>
        <Col xs={3}>
          <OrganizationValue
            id={accessProviderId}
            label={<FormattedMessage id="ui-orders.eresource.accessProvider" />}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.activated}>
        <Col xs={3}>
          <Checkbox
            checked={get(eresource, 'activated')}
            disabled
            label={<FormattedMessage id="ui-orders.eresource.activationStatus" />}
            vertical
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.activationDue}>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-orders.eresource.activationDue" />}>
            <FolioFormattedDate value={activationDueDate} />
          </KeyValue>
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.createInventory}>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.eresource.createInventory" />}
            value={get(eresource, 'createInventory')}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.materialType}>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.materialType" />}
            value={get(materialType, 'name', '')}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.trial}>
        <Col xs={3}>
          <Checkbox
            checked={get(eresource, 'trial')}
            disabled
            label={<FormattedMessage id="ui-orders.eresource.trial" />}
            vertical
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.expectedActivation}>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-orders.eresource.expectedActivation" />}>
            <FolioFormattedDate value={expectedActivation} />
          </KeyValue>
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.userLimit}>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.eresource.userLimit" />}
            value={get(eresource, 'userLimit')}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.eresource?.url}>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.eresource.url" />}
            value={resourceUrl}
          />
        </Col>
      </IfVisible>
    </Row>
  );
};

EresourcesView.propTypes = {
  line: PropTypes.shape({
    eresource: PropTypes.object,
  }),
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object,
  hiddenFields: PropTypes.object,
};

EresourcesView.defaultProps = {
  materialTypes: [],
  line: {
    eresource: {},
  },
  order: {},
  hiddenFields: {},
};

export default EresourcesView;
