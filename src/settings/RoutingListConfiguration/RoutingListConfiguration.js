import { useCallback } from 'react';
import { useHistory } from 'react-router';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';

import {
  LIST_CONFIGURATION_BASE_PATH,
  LIST_CONFIGURATION_EDIT_PATH,
} from './constants';
import RoutingListConfigurationEdit from './RoutingListConfigurationEdit';
import {
  useListConfiguration,
  useListConfigurationMutation,
} from './hooks';
import RoutingListConfigurationView from './RoutingListConfigurationView';

const RoutingListConfiguration = () => {
  const history = useHistory();
  const showCallout = useShowCallout();
  const stripes = useStripes();

  const { listConfig, refetch } = useListConfiguration();
  const { createListConfig, updateListConfig } = useListConfigurationMutation();

  const onCancel = useCallback(async () => {
    refetch();
    history.push(LIST_CONFIGURATION_BASE_PATH);
  }, [history, refetch]);

  const onMutationSuccess = useCallback(() => {
    onCancel();
    showCallout({ messageId: 'ui-orders.settings.routing.listConfiguration.update.success' });
  }, [onCancel, showCallout]);

  const onMutationError = useCallback(() => {
    showCallout({
      messageId: 'ui-orders.settings.routing.listConfiguration.update.error',
      type: 'error',
    });
  }, [showCallout]);

  const onSubmit = useCallback(async (values) => {
    const options = {
      onSuccess: onMutationSuccess,
      onError: onMutationError,
    };

    if (listConfig?.id) {
      await updateListConfig(values, options);
    } else {
      await createListConfig(values, options);
    }
  }, [onMutationSuccess, onMutationError, listConfig?.id, updateListConfig, createListConfig]);

  return (
    <Switch>
      <Route exact path={LIST_CONFIGURATION_BASE_PATH}>
        <RoutingListConfigurationView listConfig={listConfig} />
      </Route>
      <Route exact path={LIST_CONFIGURATION_EDIT_PATH}>
        <RoutingListConfigurationEdit
          stripes={stripes}
          initialValues={listConfig}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Route>
    </Switch>
  );
};

export default RoutingListConfiguration;
