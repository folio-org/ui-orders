import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import get from 'lodash/get';
import memoize from 'lodash/memoize';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  FieldSelectFinal,
  RepeatableFieldWithErrorMessage,
  TextField,
  validateRequired,
} from '@folio/stripes-acq-components';

import { PRODUCT_ID_TYPE } from '../../../common/constants';
import { VALIDATE_ISBN } from '../../Utils/resources';

const FIELD_PRODUCT_ID_TYPE = 'productIdType';

const DEFAULT_ID_TYPES = [];

function ProductIdDetailsForm({ disabled, onChangeField, identifierTypes, required, mutator }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);
  const removeField = useCallback((fields, index) => {
    fields.remove(index);
    onChangeField();
  }, [onChangeField]);
  const callValidationAPI = useCallback(
    (isbn) => memoizedMutator.validateISBN.GET({ params: { isbn } }),
    [memoizedMutator.validateISBN],
  );
  const memoizedGet = useMemo(() => memoize(callValidationAPI), [callValidationAPI]);

  const validateProductIdCB = useCallback(async (productId, formValues, blurredField) => {
    const requiredError = validateRequired(productId);

    if (requiredError) {
      return requiredError;
    }

    const isbnType = identifierTypes?.find(({ label }) => label === PRODUCT_ID_TYPE.isbn);
    const isbnTypeUUID = isbnType?.value;
    const productIdTypeUUID = get(formValues, `${blurredField}.${FIELD_PRODUCT_ID_TYPE}`);

    if (isbnTypeUUID && productIdTypeUUID === isbnTypeUUID) {
      try {
        const { isValid } = await memoizedGet(productId);

        if (!isValid) {
          return <FormattedMessage id="ui-orders.errors.invalidISBN" />;
        }
      } catch (e) {
        return <FormattedMessage id="ui-orders.errors.invalidISBN" />;
      }
    }

    return undefined;
  }, [identifierTypes, memoizedGet]);

  const renderSubForm = (elem) => {
    const validateProductId = (productId, formValues) => {
      return validateProductIdCB(productId, formValues, elem);
    };

    return (
      <Row>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productId" />}
            name={`${elem}.productId`}
            onChange={({ target: { value } }) => onChangeField(value, `${elem}.productId`)}
            isNonInteractive={disabled}
            required={required}
            validate={validateProductId}
            validateFields={[]}
          />
        </Col>
        <Col xs>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.qualifier" />}
            name={`${elem}.qualifier`}
            onChange={({ target: { value } }) => onChangeField(value, `${elem}.qualifier`)}
            isNonInteractive={disabled}
            validateFields={[]}
          />
        </Col>
        <Col xs>
          <FieldSelectFinal
            dataOptions={identifierTypes}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.productIdType" />}
            name={`${elem}.productIdType`}
            onChange={({ target: { value } }) => onChangeField(value, `${elem}.productIdType`)}
            required={required}
            isNonInteractive={disabled}
            validate={required ? validateRequired : undefined}
            validateFields={[`${elem}.productId`]}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      addLabel={disabled ? null : <FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />}
      component={RepeatableFieldWithErrorMessage}
      emptyMessage={<FormattedMessage id="ui-orders.itemDetails.addProductId" />}
      id="productIds"
      legend={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
      name="details.productIds"
      onRemove={removeField}
      canAdd={!disabled}
      canRemove={!disabled}
      renderField={renderSubForm}
    />
  );
}

ProductIdDetailsForm.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  onChangeField: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  mutator: PropTypes.object,
};

ProductIdDetailsForm.defaultProps = {
  disabled: false,
  identifierTypes: DEFAULT_ID_TYPES,
  required: true,
};

ProductIdDetailsForm.manifest = Object.freeze({
  validateISBN: VALIDATE_ISBN,
});

export default stripesConnect(ProductIdDetailsForm);
