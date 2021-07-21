import React, { useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';
import { get, keyBy } from 'lodash';

import { LocationLookup } from '@folio/stripes/smart-components';
import {
  Loading,
} from '@folio/stripes/components';
import {
  FieldSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { useHoldings } from './useHoldings';
import { getHoldingOptions } from './getHoldingOptions';
import FieldHoldingLocation from './FieldHoldingLocation';

const FieldHolding = ({
  instanceId,
  isDisabled,
  labelId,
  locationFieldName,
  locationLabelId,
  locationsForDict,
  name,
  onChange,
  required,
}) => {
  const { isLoading, holdings } = useHoldings(instanceId);
  const [selectedLocation, setSelectedLocation] = useState();
  const { values } = useFormState();
  const locationLabel = locationLabelId ? <FormattedMessage id={locationLabelId} /> : '';
  const holdingLabel = labelId ? <FormattedMessage id={labelId} /> : '';
  const validate = required ? validateRequired : undefined;

  const locationsMap = useMemo(() => keyBy(locationsForDict, 'id'), [locationsForDict]);

  useEffect(() => {
    if (!get(values, name)) {
      const locationId = get(values, locationFieldName);
      const location = locationsMap[locationId];

      setSelectedLocation(location);
    }
  }, []);

  const holdingOptions = useMemo(() => getHoldingOptions(holdings, locationsMap), [holdings, locationsMap]);

  const onChangeHolding = useCallback(
    (holdingId) => {
      const locationId = holdings.find(({ id }) => id === holdingId).permanentLocationId;

      onChange(locationId, locationFieldName, name, holdingId);
    },
    [holdings, locationFieldName, name, onChange],
  );

  const selectLocationFromPlugin = useCallback(
    (location) => {
      setSelectedLocation(location);

      onChange(location, locationFieldName, name, null);
    },
    [onChange, locationFieldName, name],
  );

  const clearSelectedLocation = useCallback(() => {
    setSelectedLocation();
    onChange(null, locationFieldName);
  }, [locationFieldName, onChange]);

  if (isLoading) return <Loading />;

  return (
    selectedLocation
      ? (
        <FieldHoldingLocation
          isNonInteractive={isDisabled}
          label={locationLabel}
          location={selectedLocation}
          onClearLocation={clearSelectedLocation}
          required={required}
        />
      )
      : (
        <div>
          <FieldSelectionFinal
            dataOptions={holdingOptions}
            isNonInteractive={isDisabled}
            fullWidth
            id={`field-${name}`}
            label={holdingLabel}
            marginBottom0
            name={name}
            required={required}
            validate={validate}
            onChange={onChangeHolding}
          />
          {!isDisabled && (
            <LocationLookup
              label={<FormattedMessage id="ui-orders.location.createHolding" />}
              onLocationSelected={selectLocationFromPlugin}
            />
          )}
        </div>
      )
  );
};

FieldHolding.propTypes = {
  instanceId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  labelId: PropTypes.string,
  locationFieldName: PropTypes.string.isRequired,
  locationLabelId: PropTypes.string.isRequired,
  locationsForDict: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
};

export default FieldHolding;
