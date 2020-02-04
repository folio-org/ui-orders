import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  get,
  toString,
} from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedDate,
  OrganizationValue,
} from '@folio/stripes-acq-components';

const PhysicalView = ({ materialTypes, physical }) => {
  const materialSupplierId = get(physical, 'materialSupplier');
  const materialTypeId = get(physical, 'materialType');
  const materialType = materialTypes.find(type => materialTypeId === type.id);

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <OrganizationValue
          id={materialSupplierId}
          label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
          value={<FolioFormattedDate value={get(physical, 'receiptDue')} />}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
          value={<FolioFormattedDate value={get(physical, 'expectedReceiptDate')} />}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.volumes" />}
          value={toString(get(physical, 'volumes'))}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.createInventory" />}
          value={get(physical, 'createInventory')}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.poLine.materialType" />}
          value={get(materialType, 'name', '')}
        />
      </Col>
    </Row>
  );
};

PhysicalView.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  physical: PropTypes.object,
};

PhysicalView.defaultProps = {
  materialTypes: [],
  physical: {},
};

export default PhysicalView;
