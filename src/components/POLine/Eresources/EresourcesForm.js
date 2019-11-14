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
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const EresourcesForm = ({ vendors, materialTypes, order, formValues }) => {
  const created = get(order, 'metadata.createdDate', '');
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);

  return (
    <Row>
      <Col xs={6} md={3}>
        <FieldAccessProvider
          vendors={vendors}
          disabled={isPostPendingOrder}
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
          disabled={isPostPendingOrder}
          required
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldMaterialType
          materialTypes={materialTypes}
          name="eresource.materialType"
          required={isMaterialTypeRequired(formValues, 'eresource.createInventory')}
          disabled={isPostPendingOrder}
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldTrial disabled={isPostPendingOrder} />
      </Col>
      <Col xs={6} md={3}>
        <FieldExpectedActivation />
      </Col>
      <Col xs={6} md={3}>
        <FieldUserLimit disabled={isPostPendingOrder} />
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
