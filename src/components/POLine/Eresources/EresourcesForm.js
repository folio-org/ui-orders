import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { IfFieldVisible } from '@folio/stripes-acq-components';

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

const EresourcesForm = ({ materialTypes, order, formValues, change, hiddenFields = {} }) => {
  const created = get(order, 'metadata.createdDate', '');
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isClosedOrder = isWorkflowStatusClosed(order);

  return (
    <Row>
      <IfFieldVisible visible={!hiddenFields.eresource?.accessProvider} name="eresource.accessProvider">
        <Col xs={6} md={3}>
          <FieldAccessProvider
            accessProviderId={formValues?.eresource?.accessProvider}
            isNonInteractive={isClosedOrder}
            change={change}
          />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.activated} name="eresource.activated">
        <Col xs={6} md={3}>
          <FieldActivated />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.activationDue} name="eresource.activationDue">
        <Col xs={6} md={3}>
          <FieldActivationDue created={created} />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.createInventory} name="eresource.createInventory">
        <Col xs={6} md={3}>
          <InventoryRecordTypeSelectField
            label="ui-orders.eresource.createInventory"
            name="eresource.createInventory"
            isNonInteractive={isPostPendingOrder}
            required
          />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.materialType} name="eresource.materialType">
        <Col xs={6} md={3}>
          <FieldMaterialType
            materialTypes={materialTypes}
            name="eresource.materialType"
            required={isMaterialTypeRequired(formValues, 'eresource.createInventory')}
            isNonInteractive={isPostPendingOrder}
          />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.trial} name="eresource.trial">
        <Col xs={6} md={3}>
          <FieldTrial disabled={isPostPendingOrder} />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.expectedActivation} name="eresource.expectedActivation">
        <Col xs={6} md={3}>
          <FieldExpectedActivation />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.userLimit} name="eresource.userLimit">
        <Col xs={6} md={3}>
          <FieldUserLimit isNonInteractive={isPostPendingOrder} />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.eresource?.url} name="eresource.url">
        <Col xs={6} md={3}>
          <FieldURL />
        </Col>
      </IfFieldVisible>
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
  hiddenFields: PropTypes.object,
};

export default EresourcesForm;
