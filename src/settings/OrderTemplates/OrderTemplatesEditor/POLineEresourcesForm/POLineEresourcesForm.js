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
import { VisibilityControl } from '../../../../common/VisibilityControl';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';
import parseNumber from '../../../../components/Utils/parseNumber';

const POLineEresourcesForm = ({ materialTypes, formValues, change }) => {
  return (
    <Row>
      <Col
        xs={3}
        data-col-order-template-eresources-access-provider
      >
        <VisibilityControl name="hiddenFields.eresource.accessProvider">
          <FieldAccessProvider
            accessProviderId={formValues?.eresource?.accessProvider}
            change={change}
            required={false}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-material-type
      >
        <VisibilityControl name="hiddenFields.eresource.materialType">
          <FieldMaterialType
            materialTypes={materialTypes}
            name="eresource.materialType"
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-activation-due
      >
        <VisibilityControl name="hiddenFields.eresource.activationDue">
          <Field
            component={TextField}
            fullWidth
            parse={parseNumber}
            label={<FormattedMessage id="ui-orders.eresource.activationDue" />}
            name="eresource.activationDue"
            type="number"
            min={0}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-extected-activation
      >
        <VisibilityControl name="hiddenFields.eresource.expectedActivation">
          <FieldExpectedActivation />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-create-inventory
      >
        <VisibilityControl name="hiddenFields.eresource.createInventory">
          <InventoryRecordTypeSelectField
            label="ui-orders.eresource.createInventory"
            name="eresource.createInventory"
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-user-limit
      >
        <VisibilityControl name="hiddenFields.eresource.userLimit">
          <FieldUserLimit />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-activated
      >
        <VisibilityControl name="hiddenFields.eresource.activated">
          <FieldActivated />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-eresources-trial
      >
        <VisibilityControl name="hiddenFields.eresource.trial">
          <FieldTrial />
        </VisibilityControl>
      </Col>
      <Col
        xs={3}
        data-col-order-template-url
      >
        <VisibilityControl name="hiddenFields.eresource.url">
          <FieldURL />
        </VisibilityControl>
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
