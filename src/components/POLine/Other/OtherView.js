import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  OrganizationValue,
} from '@folio/stripes-acq-components';

const OtherView = ({ materialTypes, physical }) => {
  const materialSupplierId = get(physical, 'materialSupplier');
  const materialTypeId = get(physical, 'materialType');
  const materialType = materialTypes.find(type => materialTypeId === type.id);

  return (
    <Row>
      <Col xs={6}>
        <OrganizationValue
          id={materialSupplierId}
          label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
        />
      </Col>
      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
          value={<FolioFormattedDate value={get(physical, 'receiptDue')} />}
        />
      </Col>
      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
          value={<FolioFormattedDate value={get(physical, 'expectedReceiptDate')} />}
        />
      </Col>
      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.createInventory" />}
          value={get(physical, 'createInventory')}
        />
      </Col>
      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.poLine.materialType" />}
          value={get(materialType, 'name', '')}
        />
      </Col>
    </Row>
  );
};

OtherView.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  physical: PropTypes.object,
};

OtherView.defaultProps = {
  physical: {},
};

export default OtherView;
