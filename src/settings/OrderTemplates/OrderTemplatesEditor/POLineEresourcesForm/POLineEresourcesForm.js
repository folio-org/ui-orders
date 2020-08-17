import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Row,
  Col,
  TextField,
} from '@folio/stripes/components';

import {
  FieldAccessProvider,
  FieldMaterialType,
  FieldActivated,
  FieldTrial,
  FieldUserLimit,
  FieldExpectedActivation,
  FieldURL,
} from '../../../../common/POLFields';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';
import parseNumber from '../../../../components/Utils/parseNumber';

const POLineEresourcesForm = ({ materialTypes, formValues, change }) => {
  return (
    <Row>
      <Col
        xs={3}
        data-col-order-template-eresources-access-provider
      >
        <FieldAccessProvider
          accessProviderId={formValues?.eresource?.accessProvider}
          change={change}
          required={false}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-material-type
      >
        <FieldMaterialType
          materialTypes={materialTypes}
          name="eresource.materialType"
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-activation-due
      >
        <Field
          component={TextField}
          fullWidth
          parse={parseNumber}
          label={<FormattedMessage id="ui-orders.eresource.activationDue" />}
          name="eresource.activationDue"
          type="number"
          min={0}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-extected-activation
      >
        <FieldExpectedActivation />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-create-inventory
      >
        <InventoryRecordTypeSelectField
          label="ui-orders.eresource.createInventory"
          name="eresource.createInventory"
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-user-limit
      >
        <FieldUserLimit />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-activated
      >
        <FieldActivated />
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-trial
      >
        <FieldTrial />
      </Col>
      <Col
        xs={3}
        data-col-order-template-url
      >
        <FieldURL />
      </Col>
    </Row>
  );
};

POLineEresourcesForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default POLineEresourcesForm;
