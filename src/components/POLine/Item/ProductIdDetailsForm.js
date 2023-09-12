import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import get from 'lodash/get';
import memoize from 'lodash/memoize';

import {
  Col,
  NoValue,
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
import ErrorMessage from './ErrorMessage';

const FIELD_PRODUCT_ID_TYPE = 'productIdType';

const DEFAULT_ID_TYPES = [];

function ProductIdDetailsForm({
  disabled,
  identifierTypes,
  isNonInteractive,
  mutator,
  onChangeField,
  onRemoveField,
  required,
}) {
  const isEditable = !(disabled || isNonInteractive);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);
  const [inValidISBNs, setInValidISBNs] = React.useState({});

  const callValidationAPI = useCallback(
    (isbn) => memoizedMutator.validateISBN.GET({ params: { isbn } }),
    [memoizedMutator.validateISBN],
  );
  const memoizedGet = useMemo(() => memoize(callValidationAPI), [callValidationAPI]);

  const validateProductIdCB = useCallback(async (productId, formValues, blurredField) => {
    const requiredError = required ? validateRequired(productId) : undefined;

    if (requiredError) {
      return requiredError;
    }

    const isbnType = identifierTypes?.find(({ label }) => label === PRODUCT_ID_TYPE.isbn);
    const isbnTypeUUID = isbnType?.value;
    const productIdTypeUUID = get(formValues, `${blurredField}.${FIELD_PRODUCT_ID_TYPE}`);

    if (isbnTypeUUID && productIdTypeUUID === isbnTypeUUID) {
      const errorMessage = <FormattedMessage id="ui-orders.errors.invalidProductId" />;

      try {
        const { isValid } = await memoizedGet(productId);

        if (!isValid) {
          setInValidISBNs((prevISBNs) => ({
            ...prevISBNs,
            [blurredField]: errorMessage,
          }));

          return errorMessage;
        }
      } catch (e) {
        setInValidISBNs((prevISBNs) => ({
          ...prevISBNs,
          [blurredField]: errorMessage,
        }));

        return errorMessage;
      }
    }

    return undefined;
  }, [identifierTypes, memoizedGet, required]);

  const renderSubForm = (elem) => {
    const validateProductId = (productId, formValues) => {
      return validateProductIdCB(productId, formValues, elem);
    };

    const showErrorMessage = inValidISBNs[elem] && (isNonInteractive || disabled);

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
          {showErrorMessage && <ErrorMessage>{inValidISBNs[elem]}</ErrorMessage>}
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

  return (
    <FieldArray
      addLabel={!isEditable ? null : <FormattedMessage id="ui-orders.itemDetails.addProductIdBtn" />}
      component={RepeatableFieldWithErrorMessage}
      emptyMessage={!isEditable ? <NoValue /> : <FormattedMessage id="ui-orders.itemDetails.addProductId" />}
      id="productIds"
      legend={<FormattedMessage id="ui-orders.itemDetails.productIds" />}
      name="details.productIds"
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
  mutator: PropTypes.object,
};

ProductIdDetailsForm.defaultProps = {
  disabled: false,
  identifierTypes: DEFAULT_ID_TYPES,
  isNonInteractive: false,
  required: true,
};

ProductIdDetailsForm.manifest = Object.freeze({
  validateISBN: VALIDATE_ISBN,
});

export default stripesConnect(ProductIdDetailsForm);
