import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

const OtherView = ({ materialTypes, physical, vendors }) => {
  const materialSupplierId = get(physical, 'materialSupplier');
  const materialSupplier = vendors.find(v => v.id === materialSupplierId);
  const materialTypeId = get(physical, 'materialType');
  const materialType = materialTypes.find(type => materialTypeId === type.id);

  return (
    <Row>
      <Col xs={6}>
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
          value={get(materialSupplier, 'name', '')}
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
  vendors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

OtherView.defaultProps = {
  physical: {},
};

export default OtherView;
