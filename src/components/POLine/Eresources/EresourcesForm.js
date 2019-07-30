import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldAccessProvider,
  FieldMaterialType,
  FieldActivated,
  FieldTrial,
  FieldUserLimit,
  FieldExpectedActivation,
  FieldActivationDue,
} from '../../../common/POLFields';
import { isRequiredWithFieldValue, isWorkflowStatusOpen } from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { INVENTORY_RECORDS_TYPE } from '../const';

const EresourcesForm = ({ vendors, materialTypes, order, formValues }) => {
  const created = get(order, 'metadata.createdDate', '');
  const isOpenedOrder = isWorkflowStatusOpen(order);

  return (
    <Row>
      <Col xs={6} md={3}>
        <FieldAccessProvider
          vendors={vendors}
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldActivated />
      </Col>
      <Col xs={6} md={3}>
        <FieldActivationDue created={created} />
      </Col>
      <Col xs={6} md={3}>
        <InventoryRecordTypeSelectField
          label="ui-orders.eresource.createInventory"
          name="eresource.createInventory"
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldMaterialType
          materialTypes={materialTypes}
          name="eresource.materialType"
          required={isRequiredWithFieldValue(formValues, 'eresource.createInventory', INVENTORY_RECORDS_TYPE.all)}
          disabled={isOpenedOrder}
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldTrial disabled={isOpenedOrder} />
      </Col>
      <Col xs={6} md={3}>
        <FieldExpectedActivation />
      </Col>
      <Col xs={6} md={3}>
        <FieldUserLimit disabled={isOpenedOrder} />
      </Col>
    </Row>
  );
};

EresourcesForm.propTypes = {
  vendors: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  order: PropTypes.object,
  formValues: PropTypes.object.isRequired,
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default EresourcesForm;
