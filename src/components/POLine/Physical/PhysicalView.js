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

import { IfVisible } from '../../../common/IfVisible';

const PhysicalView = ({ materialTypes, physical, hiddenFields }) => {
  const materialSupplierId = get(physical, 'materialSupplier');
  const materialTypeId = get(physical, 'materialType');
  const materialType = materialTypes.find(type => materialTypeId === type.id);

  return (
    <Row start="xs">
      <IfVisible visible={!hiddenFields.physical?.materialSupplier}>
        <Col
          xs={6}
          lg={3}
        >
          <OrganizationValue
            id={materialSupplierId}
            label={<FormattedMessage id="ui-orders.physical.materialSupplier" />}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.physical?.receiptDue}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
            value={<FolioFormattedDate value={get(physical, 'receiptDue')} />}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.physical?.expectedReceiptDate}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
            value={<FolioFormattedDate value={get(physical, 'expectedReceiptDate')} />}
          />
        </Col>
      </IfVisible>

      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.physical.volumes" />}
          value={toString(get(physical, 'volumes'))}
        />
      </Col>

      <IfVisible visible={!hiddenFields.physical?.createInventory}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.physical.createInventory" />}
            value={get(physical, 'createInventory')}
          />
        </Col>
      </IfVisible>

      <IfVisible visible={!hiddenFields.physical?.materialType}>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.materialType" />}
            value={get(materialType, 'name', '')}
          />
        </Col>
      </IfVisible>
    </Row>
  );
};

PhysicalView.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  physical: PropTypes.object,
  hiddenFields: PropTypes.object,
};

PhysicalView.defaultProps = {
  materialTypes: [],
  physical: {},
  hiddenFields: {},
};

export default PhysicalView;
