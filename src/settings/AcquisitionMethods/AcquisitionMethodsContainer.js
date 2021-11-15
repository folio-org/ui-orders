import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import {
  CONFIG_API,
  LIMIT_MAX,
  MODULE_ORDERS,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  CONFIG_ACQ_METHODS,
  getAcqMethodsConfig,
  parseAcqMethodRow,
  validateAcqMethods,
} from './utils';

import { AcquisitionMethods } from './AcquisitionMethods';
import { DeleteAcqMethodModal } from './DeleteAcqMethodModal';

const label = <FormattedMessage id="ui-orders.settings.acquisitionMethods" />;
const labelSingular = <FormattedMessage id="ui-orders.settings.acquisitionMethods.singular" />;

const AcquisitionMethodsContainer = ({ resources, mutator }) => {
  const [isConfirmModalOpen, toggleConfirmModal] = useModalToggle();
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const showCallout = useShowCallout();
  const deleteItemPromise = useRef({});

  const contentData = useMemo(
    () => resources.values.records.map(parseAcqMethodRow),
    [resources.values.records],
  );

  const nameToDelete = useMemo(() => (
    contentData.find(field => field?.id === itemIdToDelete)?.name
  ), [itemIdToDelete, contentData]);

  const onCreate = useCallback(item => mutator.values.POST({
    ...getAcqMethodsConfig(item),
    value: JSON.stringify(item),
  }), [mutator]);

  const onUpdate = useCallback(item => {
    mutator.activeRecord.update({ id: item?.id });

    return mutator.values.PUT({
      ...getAcqMethodsConfig(item),
      value: JSON.stringify({
        name: item?.name,
      }),
    });
  }, [mutator]);

  const showConfirmModal = (itemId) => {
    setItemIdToDelete(itemId);

    return new Promise((resolve, reject) => {
      deleteItemPromise.current = { resolve, reject };
      toggleConfirmModal();
    });
  };

  const onDelete = useCallback(() => {
    return mutator.values.DELETE({ id: itemIdToDelete })
      .then(() => {
        deleteItemPromise.current?.resolve();
        showCallout({
          messageId: 'stripes-smart-components.cv.termDeleted',
          values: { type: labelSingular, term: nameToDelete },
        });
      })
      .catch(() => {
        deleteItemPromise.current?.reject();
        showCallout({
          messageId: 'ui-orders.settings.acquisitionMethods.remove.error',
          type: 'error',
          values: { term: nameToDelete },
        });
      })
      .finally(toggleConfirmModal);
  }, [mutator, itemIdToDelete, nameToDelete, showCallout, toggleConfirmModal]);

  return (
    <Paneset id="pane-acquisition-methods">
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={label}
      >
        <AcquisitionMethods
          contentData={contentData}
          isPending={resources.values.isPending}
          label={label}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={showConfirmModal}
          validate={validateAcqMethods}
        />
        <DeleteAcqMethodModal
          open={isConfirmModalOpen}
          nameToDelete={nameToDelete}
          onConfirm={onDelete}
          onCancel={toggleConfirmModal}
        />
      </Pane>
    </Paneset>
  );
};

AcquisitionMethodsContainer.manifest = Object.freeze({
  values: {
    type: 'okapi',
    path: CONFIG_API,
    records: 'configs',
    throwErrors: false,
    PUT: {
      path: `${CONFIG_API}/%{activeRecord.id}`,
    },
    GET: {
      params: {
        query: `(module=${MODULE_ORDERS} and configName=${CONFIG_ACQ_METHODS})`,
        limit: LIMIT_MAX.toString(),
      },
    },
  },
  activeRecord: {},
});

AcquisitionMethodsContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default AcquisitionMethodsContainer;
