import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
} from 'redux-form';

import {
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelect,
  RepeatableFieldWithErrorMessage,
  validateRequired,
} from '@folio/stripes-acq-components';

function ProductIdDetailsForm({ disabled, onChangeField, identifierTypes, required }) {
  const removeField = useCallback((fields, index) => {
    fields.remove(index);
    onChangeField();
  }, [onChangeField]);

  const renderSubForm = (elem) => {
    return (
      <Row>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            name={`${elem}.productId`}
            onChange={(e, value) => onChangeField(value, `${elem}.productId`)}
            disabled={disabled}
            required={required}
            validate={required ? validateRequired : undefined}
          />
        </Col>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.qualifier" />}
            name={`${elem}.qualifier`}
            onChange={(e, value) => onChangeField(value, `${elem}.qualifier`)}
            disabled={disabled}
          />
        </Col>
        <Col xs>
          <FieldSelect
            dataOptions={identifierTypes}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            name={`${elem}.productIdType`}
            onChange={(e, value) => onChangeField(value, `${elem}.productIdType`)}
            required={required}
            disabled={disabled}
            validate={required ? validateRequired : undefined}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      addLabel={<FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />}
      component={RepeatableFieldWithErrorMessage}
      emptyMessage={<FormattedMessage id="ui-orders.itemDetails.addProductId" />}
      id="productIds"
      legend={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
      name="details.productIds"
      onRemove={removeField}
      props={{
        canAdd: !disabled,
        canRemove: !disabled,
      }}
      renderField={renderSubForm}
    />
  );
}

ProductIdDetailsForm.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  onChangeField: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

ProductIdDetailsForm.defaultProps = {
  disabled: false,
  identifierTypes: [],
  required: true,
};

export default ProductIdDetailsForm;
