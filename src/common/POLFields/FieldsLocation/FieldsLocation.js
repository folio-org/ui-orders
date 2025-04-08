import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Col,
  MessageBanner,
  Row,
} from '@folio/stripes/components';
import {
  ConsortiumFieldInventory,
  FieldInventory,
  RepeatableFieldWithValidation,
  TextField,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import {
  addFieldArrayItemWithUniqueKey,
  getFieldUniqueKey,
} from '../../utils';
import {
  isLocationEresourceQuantityRequired,
  isLocationPhysicalQuantityRequired,
  isLocationsRequired,
  parseQuantity,
  validateLocation,
  validateQuantityElectronic,
  validateQuantityPhysical,
} from './validate';

const NO_VALIDATE = undefined;

const FieldsLocation = ({
  centralOrdering = false,
  changeLocation,
  filterHoldings,
  filterLocations,
  isDisabledToChangePaymentInfo,
  isPostPendingOrder,
  isQuantityDisabled,
  locationIds,
  locations,
  pOLineFormValues: { orderFormat, physical, eresource, instanceId, isPackage } = {},
  pOLineFormValues,
  poNumber,
  withValidation,
}) => {
  if (!locations) return null;

  const isPhysicalQuantityRequired = isLocationPhysicalQuantityRequired(orderFormat, physical?.createInventory);
  const isElectronicQuantityRequired = isLocationEresourceQuantityRequired(orderFormat, eresource?.createInventory);
  const isPhysicalQuantityVisible = !isPackage || (orderFormat !== ORDER_FORMATS.electronicResource);
  const isElectronicQuantityVisible = !isPackage ||
    (orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix);
  const validate = withValidation ? validateLocation : NO_VALIDATE;
  const receivingLink = `/receiving?qindex=purchaseOrder.poNumber&query=${poNumber}`;

  const isInstanceIdRequired = instanceId ? (isPhysicalQuantityRequired || isElectronicQuantityRequired) : false;
  const instanceIdProp = isInstanceIdRequired ? { instanceId } : {};

  const validateLocations = (locationValues, formValues) => {
    if (withValidation) {
      return isPostPendingOrder ? NO_VALIDATE : isLocationsRequired(locationValues, formValues);
    }

    return NO_VALIDATE;
  };

  const FieldInventoryComponent = centralOrdering
    ? ConsortiumFieldInventory
    : FieldInventory;

  return (
    <>
      {isQuantityDisabled && (
        <MessageBanner type="warning">
          <FormattedMessage
            id="ui-orders.cost.quantityPopover"
          />
          {' '}
          <Link to={receivingLink}>
            <FormattedMessage id="ui-orders.location.editInReceiving" />
          </Link>
        </MessageBanner>
      )}
      <FieldArray
        getFieldUniqueKey={getFieldUniqueKey}
        onAdd={addFieldArrayItemWithUniqueKey}
        addLabel={isDisabledToChangePaymentInfo ? null : <FormattedMessage id="ui-orders.location.button.addLocation" />}
        component={RepeatableFieldWithValidation}
        name="locations"
        validate={validateLocations}
        canAdd={!(isDisabledToChangePaymentInfo || isQuantityDisabled)}
        canRemove={!(isDisabledToChangePaymentInfo || isQuantityDisabled)}
        renderField={(field) => {
          const receivingTenantId = get(pOLineFormValues, field, {})?.tenantId;

          return (
            <Row>
              <Col xs={6}>
                <FieldInventoryComponent
                  additionalAffiliationIds={receivingTenantId ? [receivingTenantId] : []}
                  affiliationName={`${field}.tenantId`}
                  locationIds={locationIds}
                  locations={locations}
                  holdingName={`${field}.holdingId`}
                  locationName={`${field}.locationId`}
                  onChange={changeLocation}
                  isNonInteractive={isDisabledToChangePaymentInfo || isQuantityDisabled}
                  required={withValidation}
                  filterHoldings={filterHoldings}
                  filterLocations={filterLocations}
                  validate={validate}
                  {...instanceIdProp}
                />
              </Col>
              {isPhysicalQuantityVisible && (
                <Col xs={3}>
                  <Field
                    component={TextField}
                    disabled={isQuantityDisabled}
                    label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
                    name={`${field}.quantityPhysical`}
                    parse={parseQuantity}
                    required={withValidation && isPhysicalQuantityRequired}
                    type="number"
                    validate={withValidation ? validateQuantityPhysical : NO_VALIDATE}
                    isNonInteractive={isDisabledToChangePaymentInfo}
                  />
                </Col>
              )}
              {isElectronicQuantityVisible && (
                <Col xs={3}>
                  <Field
                    component={TextField}
                    disabled={isQuantityDisabled}
                    label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
                    name={`${field}.quantityElectronic`}
                    parse={parseQuantity}
                    required={withValidation && isElectronicQuantityRequired}
                    type="number"
                    validate={withValidation ? validateQuantityElectronic : NO_VALIDATE}
                    isNonInteractive={isDisabledToChangePaymentInfo}
                  />
                </Col>
              )}
            </Row>
          );
        }}
      />
    </>
  );
};

FieldsLocation.propTypes = {
  centralOrdering: PropTypes.bool,
  changeLocation: PropTypes.func.isRequired,
  filterHoldings: PropTypes.func,
  filterLocations: PropTypes.func,
  isDisabledToChangePaymentInfo: PropTypes.bool,
  isPostPendingOrder: PropTypes.bool,
  isQuantityDisabled: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  pOLineFormValues: PropTypes.object,
  poNumber: PropTypes.string,
  withValidation: PropTypes.bool,
};

FieldsLocation.defaultProps = {
  locations: [],
  isDisabledToChangePaymentInfo: false,
  isPostPendingOrder: false,
  isQuantityDisabled: false,
  withValidation: true,
};

export default FieldsLocation;
