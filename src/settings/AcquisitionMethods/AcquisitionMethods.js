import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';
import { EditableList } from '@folio/stripes/smart-components';

const columnMapping = {
  name: <FormattedMessage id="ui-orders.settings.acquisitionMethods.name" />,
};
const visibleFields = ['name'];

export const AcquisitionMethods = ({
  contentData,
  onCreate,
  onUpdate,
  onDelete,
  label,
  isPending,
  validate,
}) => {
  const stripes = useStripes();

  return (
    <EditableList
      id="acquisition-methods"
      editable={stripes.hasPerm('ui-orders.settings.all')}
      contentData={contentData}
      columnMapping={columnMapping}
      visibleFields={visibleFields}
      label={label}
      createButtonLabel={<FormattedMessage id="stripes-core.button.new" />}

      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}

      totalCount={contentData.length}
      isEmptyMessage={
        isPending
          ? <Loading />
          : (
            <FormattedMessage
              id="stripes-smart-components.cv.noExistingTerms"
              values={{ terms: label }}
            />
          )
      }
      validate={validate}
    />
  );
};

AcquisitionMethods.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.node.isRequired,
  onCreate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  validate: PropTypes.func.isRequired,
};
