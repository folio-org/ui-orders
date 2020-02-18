import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Pluggable,
  stripesConnect,
} from '@folio/stripes/core';
import {
  TextField,
  IconButton,
} from '@folio/stripes/components';
import {
  organizationByPropManifest,
  validateRequired,
} from '@folio/stripes-acq-components';

const FieldOrganization = ({
  change,
  disabled,
  dispatch,
  labelId,
  name,
  required,
  id,
  mutator,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});

  useEffect(() => {
    if (id && selectedOrganization.id !== id) {
      mutator.fieldOrganizationOrg.GET()
        .then(setSelectedOrganization);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const selectOrganization = useCallback(
    (organization) => {
      setSelectedOrganization(organization);

      dispatch(change(name, organization.id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  );

  const clearOrganization = useCallback(
    () => {
      setSelectedOrganization({});

      dispatch(change(name, null));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name],
  );

  const clearButton = useMemo(
    () => {
      if (selectedOrganization.id && !disabled) {
        return (
          <IconButton
            onClick={clearOrganization}
            icon="times-circle-solid"
            size="small"
          />
        );
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedOrganization, disabled],
  );

  return (
    <div>
      <Field
        id={name}
        component={TextField}
        disabled
        endControl={clearButton}
        fullWidth
        hasClearIcon={false}
        label={<FormattedMessage id={labelId} />}
        name={name}
        required={required}
        validate={required ? validateRequired : undefined}
        format={() => selectedOrganization.name}
      />

      {!disabled && (
        <div>
          <Pluggable
            aria-haspopup="true"
            dataKey="organization"
            searchButtonStyle="link"
            searchLabel={<FormattedMessage id="stripes-acq-components.filter.organization.lookup" />}
            selectVendor={selectOrganization}
            type="find-organization"
          >
            <FormattedMessage id="stripes-acq-components.filter.organization.lookupNoSupport" />
          </Pluggable>
        </div>
      )}
    </div>
  );
};

FieldOrganization.propTypes = {
  change: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelId: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  mutator: PropTypes.object.isRequired,
};

FieldOrganization.defaultProps = {
  disabled: false,
  required: true,
};

FieldOrganization.manifest = {
  fieldOrganizationOrg: organizationByPropManifest,
};

export default stripesConnect(FieldOrganization);
