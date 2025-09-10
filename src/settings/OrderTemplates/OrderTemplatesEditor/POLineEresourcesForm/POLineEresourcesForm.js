import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';
import { VisibilityControl } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import {
  FieldAccessProvider,
  FieldActivated,
  FieldExpectedActivation,
  FieldMaterialType,
  FieldTrial,
  FieldURL,
  FieldUserLimit,
} from '../../../../common/POLFields';
import parseNumber from '../../../../components/Utils/parseNumber';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLineEresourcesForm = ({
  change,
  formValues,
  materialTypes,
}) => {
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
            name={POL_FORM_FIELDS.eresourceMaterialType}
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
            name={POL_FORM_FIELDS.eresourceActivationDue}
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
            name={POL_FORM_FIELDS.eresourceCreateInventory}
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
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default POLineEresourcesForm;
