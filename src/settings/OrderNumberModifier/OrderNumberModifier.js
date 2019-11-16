import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { Field } from 'redux-form';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { CONFIG_API } from '../../components/Utils/api';

import css from './OrderNumberModifier.css';

const fieldComponents = {
  // eslint-disable-next-line react/prop-types
  name: ({ fieldProps }) => {
    return (
      <Field
        {...fieldProps}
        component={TextField}
        fullWidth
      />
    );
  },
  // eslint-disable-next-line react/prop-types
  description: ({ fieldProps }) => {
    return (
      <Field
        {...fieldProps}
        component={TextArea}
        fullWidth
      />
    );
  },
};

const parseRow = row => {
  let value;

  try {
    value = JSON.parse(row.value || '{}');
  } catch (e) {
    value = {};
  }

  return {
    name: value.name,
    description: value.description,
    ...row,
  };
};

const hiddenFields = ['numberOfObjects'];
const visibleFields = ['name', 'description'];
const columnMapping = {
  name: <FormattedMessage id="ui-orders.settings.poNumber.modifier.name" />,
  description: <FormattedMessage id="ui-orders.settings.poNumber.modifier.description" />,
};
const formatter = {
  description: item => (<div className={css.orderNumberModifierWrapper}>{item.description}</div>),
};

export const getOrderNumberModifierManifest = (moduleName, configName) => {
  return Object.freeze({
    values: {
      type: 'okapi',
      path: CONFIG_API,
      records: 'configs',
      throwErrors: false,
      clientGeneratePk: true,
      PUT: {
        path: `${CONFIG_API}/%{activeRecord.id}`,
      },
      DELETE: {
        path: `${CONFIG_API}/%{activeRecord.id}`,
      },
      GET: {
        params: {
          query: `(module=${moduleName} and configName=${moduleName.toLowerCase()}.${configName})`,
          limit: LIMIT_MAX.toString(),
        },
      },
    },
    updaterIds: [],
    activeRecord: {},
    updaters: {
      type: 'okapi',
      records: 'users',
      path: 'users',
      GET: {
        params: {
          query: (queryParams, pathComponents, resourceValues) => {
            if (resourceValues.updaterIds && resourceValues.updaterIds.length) {
              return `(${resourceValues.updaterIds.join(' or ')})`;
            }

            return null;
          },
        },
      },
    },
  });
};

const OrderNumberModifier = ({
  moduleName,
  intl,
  configName,
  objectLabel,
  stripes,
  resources,
  mutator,
  labelId,
  labelSingularId,
}) => {
  const onCreate = useCallback(
    item => ({
      value: JSON.stringify(item),
      module: moduleName,
      configName: `${moduleName.toLowerCase()}.${configName}`,
      code: `${configName.toUpperCase()}_${(new Date()).valueOf()}`,
    }),
    [moduleName, configName],
  );

  const onUpdate = useCallback(
    item => ({
      code: item.code,
      id: item.id,
      module: item.module,
      configName: item.configName,
      value: JSON.stringify({
        name: item.name,
        description: item.description,
      }),
    }),
    [],
  );

  return (
    <ControlledVocab
      stripes={stripes}
      resources={resources}
      mutator={mutator}
      dataKey={undefined}
      baseUrl="configurations/entries"
      records="configs"
      parseRow={parseRow}
      label={intl.formatMessage({ id: labelId })}
      labelSingular={intl.formatMessage({ id: labelSingularId })}
      objectLabel={objectLabel}
      visibleFields={visibleFields}
      columnMapping={columnMapping}
      hiddenFields={hiddenFields}
      fieldComponents={fieldComponents}
      nameKey="name"
      id={configName}
      sortby="name"
      preCreateHook={onCreate}
      preUpdateHook={onUpdate}
      formatter={formatter}
    />
  );
};

OrderNumberModifier.propTypes = {
  moduleName: PropTypes.string.isRequired,
  configName: PropTypes.string.isRequired,
  objectLabel: PropTypes.node.isRequired,
  intl: intlShape.isRequired,
  stripes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  labelId: PropTypes.string.isRequired,
  labelSingularId: PropTypes.string.isRequired,
};

export default injectIntl(OrderNumberModifier);
