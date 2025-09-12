import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Layout,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  RepeatableFieldWithErrorMessage,
  TextField,
  validateRequired,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../common/constants';

const DEFAULT_ID_TYPES = [];

function ProductIdDetailsForm({
  disabled,
  identifierTypes,
  isNonInteractive,
  onChangeField,
  onRemoveField,
  required,
}) {
  const isEditable = !(disabled || isNonInteractive);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const validateProductId = useCallback((productId) => {
    return required ? validateRequired(productId) : undefined;
  }, [required]);

  const renderSubForm = (elem) => {
    return (
      <Row>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            disabled={disabled}
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            name={`${elem}.productId`}
            onChange={({ target: { value } }) => onChangeField(value, `${elem}.productId`)}
            isNonInteractive={isNonInteractive}
            required={required}
            validate={validateProductId}
            validateFields={[]}
          />
        </Col>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            disabled={disabled}
            label={<FormattedMessage id="ui-orders.itemDetails.qualifier" />}
            name={`${elem}.qualifier`}
            onChange={({ target: { value } }) => onChangeField(value, `${elem}.qualifier`)}
            isNonInteractive={isNonInteractive}
            validateFields={[]}
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            dataOptions={identifierTypes}
            fullWidth
            disabled={disabled}
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            name={`${elem}.productIdType`}
            onChange={({ target: { value } }) => onChangeField(value, `${elem}.productIdType`)}
            required={required}
            isNonInteractive={isNonInteractive}
            validate={required ? validateRequired : undefined}
            validateFields={[`${elem}.productId`]}
          />
        </Col>
      </Row>
    );
  };

  const legend = (
    <Layout className="display-flex">
      <FormattedMessage id="ui-orders.itemDetails.productIds" />
      <Layout className="margin-start-gutter">
        <VisibilityControl
          name="hiddenFields.details.productIds"
          detached
        />
      </Layout>
    </Layout>
  );

  return (
    <FieldArray
      addLabel={!isEditable ? null : <FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />}
      component={RepeatableFieldWithErrorMessage}
      emptyMessage={!isEditable ? <NoValue /> : <FormattedMessage id="ui-orders.itemDetails.addProductId" />}
      id="productIds"
      legend={legend}
      name={POL_FORM_FIELDS.productIds}
      onRemove={onRemoveField}
      canAdd={isEditable}
      canRemove={isEditable}
      renderField={renderSubForm}
    />
  );
}

ProductIdDetailsForm.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  isNonInteractive: PropTypes.bool,
  onChangeField: PropTypes.func.isRequired,
  onRemoveField: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

ProductIdDetailsForm.defaultProps = {
  disabled: false,
  identifierTypes: DEFAULT_ID_TYPES,
  isNonInteractive: false,
  required: true,
};

export default ProductIdDetailsForm;
