import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { getFormValues } from 'redux-form';

import { LoadingView } from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import { PO_FORM_NAME } from '../../common/constants';
import {
  prefixesResource,
  suffixesResource,
} from '../../common/resources';
import { getUserNameById } from '../../common/utils';
import {
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
} from '../Utils/api';
import {
  getFullOrderNumber,
  updateOrderResource,
} from '../Utils/orderResource';
import {
  ADDRESSES,
  ORDER,
  ORDER_NUMBER_SETTING,
  ORDER_TEMPLATES,
  USERS,
} from '../Utils/resources';
import {
  showUpdateOrderError,
} from '../Utils/order';
import POForm from '../PurchaseOrder/POForm';
import { UpdateOrderErrorModal } from '../PurchaseOrder/UpdateOrderErrorModal';

function LayerPO({
  history,
  location,
  match: { params: { id } },
  mutator,
  resources,
  stripes,
}) {
  const sendCallout = useShowCallout();

  // this is required to avoid huge refactoring of processing error messages for now
  const context = useMemo(() => ({ sendCallout }), [sendCallout]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);

  const [savingValues, setSavingValues] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [createdByName, setCreatedByName] = useState('');
  const [assignedToUser, setAssignedToUser] = useState('');
  const [updateOrderError, setUpdateOrderError] = useState(null);
  const order = id ? resources?.order?.records[0] : {};
  const metadata = order?.metadata;
  const assignedTo = order?.assignedTo;

  const setUserFields = useCallback(() => {
    if (metadata) {
      getUserNameById(memoizedMutator.users, get(metadata, 'createdByUserId'))
        .then(setCreatedByName);
    }

    if (assignedTo) {
      getUserNameById(memoizedMutator.users, assignedTo)
        .then(setAssignedToUser);
    }
  }, [assignedTo, memoizedMutator.users, metadata]);

  useEffect(() => {
    setUserFields();

    memoizedMutator.orderNumber.reset();
    memoizedMutator.orderNumber.GET()
      .finally(setIsLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeErrorModal = useCallback(() => {
    setUpdateOrderError(null);
  }, []);

  const openOrderErrorModalShow = useCallback(setUpdateOrderError, []);

  const updatePO = useCallback(values => {
    const poNumber = getFullOrderNumber(values) || undefined;

    setIsLoading(true);
    setSavingValues({ ...values, poNumber });

    return updateOrderResource(values, memoizedMutator.order, { poNumber })
      .then(savedOrder => {
        sendCallout({
          message: <SafeHTMLMessage id="ui-orders.order.save.success" values={{ orderNumber: savedOrder.poNumber }} />,
        });
        setTimeout(() => history.push({
          pathname: `/orders/view/${savedOrder.id}`,
          search: location.search,
        }));
      })
      .catch(async e => {
        setIsLoading(false);
        await showUpdateOrderError(e, context, openOrderErrorModalShow);
      });
  }, [context, history, location.search, memoizedMutator.order, openOrderErrorModalShow, sendCallout]);

  const onCancel = useCallback(
    () => {
      history.push({
        pathname: id ? `/orders/view/${id}` : '/orders',
        search: location.search,
      });
    },
    [history, id, location.search],
  );

  if (isLoading || !order) return <LoadingView dismissible onClose={onCancel} />;

  const { poNumber, poNumberPrefix, poNumberSuffix } = order;
  const generatedNumber = get(resources, 'orderNumber.records.0.poNumber');
  const purePONumber = id
    ? poNumber.slice(poNumberPrefix?.length, -poNumberSuffix?.length || undefined)
    : generatedNumber;
  const patchedOrder = {
    ...order,
    poNumber: purePONumber,
    createdByName,
    assignedToUser,
  };
  const initialValues = savingValues || patchedOrder; // use entered values in case of error response
  const formValues = getFormValues(PO_FORM_NAME)(stripes.store.getState());

  return (
    <>
      <POForm
        formValues={formValues} // hack to re-render redux-form
        generatedNumber={generatedNumber}
        initialValues={initialValues}
        onCancel={onCancel}
        onSubmit={updatePO}
        parentMutator={memoizedMutator}
        parentResources={resources}
        stripes={stripes}
      />
      {updateOrderError && (
        <UpdateOrderErrorModal
          orderNumber={patchedOrder.poNumber}
          errors={updateOrderError}
          cancel={closeErrorModal}
        />
      )}
    </>
  );
}

LayerPO.manifest = Object.freeze({
  order: ORDER,
  addresses: ADDRESSES,
  users: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
  orderNumber: {
    accumulate: true,
    fetch: false,
    path: ORDER_NUMBER_API,
    throwErrors: false,
    clientGeneratePk: false,
    type: 'okapi',
    POST: {
      path: ORDER_NUMBER_VALIDATE_API,
    },
  },
  orderNumberSetting: ORDER_NUMBER_SETTING,
  prefixesSetting: prefixesResource,
  suffixesSetting: suffixesResource,
  orderTemplates: ORDER_TEMPLATES,
});

LayerPO.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(LayerPO);
