import React, { useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';
import { get, keyBy } from 'lodash';

import { LocationLookup } from '@folio/stripes/smart-components';
import {
  IconButton,
  KeyValue,
  Loading,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelectionFinal,
  LIMIT_MAX,
  validateRequired,
} from '@folio/stripes-acq-components';

import { useHoldings } from './useHoldings';

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
  const searchParams = { query: `instanceId==${instanceId}`, limit: LIMIT_MAX };
  const { isLoading, holdings } = useHoldings({ searchParams });
  const [selectedLocation, setSelectedLocation] = useState();
  const { values } = useFormState();

  const locationsMap = useMemo(() => keyBy(locationsForDict, 'id'), [locationsForDict]);

  useEffect(() => {
    if (!get(values, name)) {
      const locationId = get(values, locationFieldName);
      const location = locationsMap[locationId];

      setSelectedLocation(location);
    }
  }, []);

  const holdingOptions = useMemo(() => (
    holdings?.map(({ id, permanentLocationId, callNumber, callNumberPrefix, callNumberSuffix }) => {
      const callNumberLabel = `${callNumberPrefix || ''} ${callNumber || ''} ${callNumberSuffix || ''}`.trim();

      return ({
        value: id,
        label: `${locationsMap[permanentLocationId].name} ${callNumberLabel ? ` > ${callNumberLabel}` : ''}`,
      });
    })
  ), [holdings, locationsMap]);

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

  const clearButton = (
    <IconButton
      onClick={clearSelectedLocation}
      icon="times-circle-solid"
      size="small"
    />
  );

  if (isLoading) return <Loading />;

  const locationForNewHolding = () => {
    if (!selectedLocation) return null;

    return isDisabled
      ? (
        <KeyValue
          label={labelId ? <FormattedMessage id={locationLabelId} /> : ''}
          value={`${selectedLocation.name}(${selectedLocation.code})`}
        />
      )
      : (
        <TextField
          label={labelId ? <FormattedMessage id={locationLabelId} /> : ''}
          required={required}
          disabled
          value={`${selectedLocation.name}(${selectedLocation.code})`}
          endControl={clearButton}
        />
      );
  };

  return (
    selectedLocation
      ? locationForNewHolding()
      : (
        <div>
          <FieldSelectionFinal
            dataOptions={holdingOptions}
            isNonInteractive={isDisabled}
            fullWidth
            id={`field-${name}`}
            label={labelId ? <FormattedMessage id={labelId} /> : ''}
            marginBottom0
            name={name}
            required={required}
            validate={required ? validateRequired : undefined}
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
