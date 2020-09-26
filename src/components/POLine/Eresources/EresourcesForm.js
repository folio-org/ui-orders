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
  FieldURL,
} from '../../../common/POLFields';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
} from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const EresourcesForm = ({ materialTypes, order, formValues, change }) => {
  const created = get(order, 'metadata.createdDate', '');
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isClosedOrder = isWorkflowStatusClosed(order);

  return (
    <Row>
      <Col xs={6} md={3}>
        <FieldAccessProvider
          accessProviderId={formValues?.eresource?.accessProvider}
          isNonInteractive={isClosedOrder}
          change={change}
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
          isNonInteractive={isPostPendingOrder}
          required
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldMaterialType
          materialTypes={materialTypes}
          name="eresource.materialType"
          required={isMaterialTypeRequired(formValues, 'eresource.createInventory')}
          isNonInteractive={isPostPendingOrder}
        />
      </Col>
      <Col xs={6} md={3}>
        <FieldTrial disabled={isPostPendingOrder} />
      </Col>
      <Col xs={6} md={3}>
        <FieldExpectedActivation />
      </Col>
      <Col xs={6} md={3}>
        <FieldUserLimit isNonInteractive={isPostPendingOrder} />
      </Col>
      <Col xs={6} md={3}>
        <FieldURL />
      </Col>
    </Row>
  );
};

EresourcesForm.propTypes = {
  order: PropTypes.object,
  formValues: PropTypes.object.isRequired,
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  change: PropTypes.func.isRequired,
};

export default EresourcesForm;
