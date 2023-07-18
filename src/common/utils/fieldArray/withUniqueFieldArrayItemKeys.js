import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';

import {
  injectUniqueFieldArrayItemKeys,
  omitUniqueFieldArrayItemKeys,
} from './uniqueFieldArrayItemKeys';

/**
 * Higher-Order Component that controls the processing of injection and cleanup of unique item identifiers for the passed field arrays.
 *
 * @param {React.Component} WrappedForm - Stripes form to wrap.
 */
export const withUniqueFieldArrayItemKeys = WrappedForm => {
  function FormWrapper(props) {
    const {
      fieldArraysToHydrate,
      initialValues: initialValuesProp,
      onSubmit: onSubmitProp,
      ...rest
    } = props;

    const initialValues = useMemo(() => (
      injectUniqueFieldArrayItemKeys(initialValuesProp, fieldArraysToHydrate)
    ), [fieldArraysToHydrate, initialValuesProp]);

    const onSubmit = useCallback((values) => {
      return onSubmitProp(omitUniqueFieldArrayItemKeys(values, fieldArraysToHydrate));
    }, [fieldArraysToHydrate, onSubmitProp]);

    return (
      <WrappedForm
        {...rest}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    );
  }

  FormWrapper.propTypes = {
    fieldArraysToHydrate: PropTypes.arrayOf(PropTypes.string),
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  };

  return FormWrapper;
};
