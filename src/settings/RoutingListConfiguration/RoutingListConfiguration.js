import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { LoadingPane } from '@folio/stripes/components';
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
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

const RoutingListConfiguration = ({ label }) => {
  const history = useHistory();
  const intl = useIntl();
  const showCallout = useShowCallout();
  const stripes = useStripes();

  const { listConfig, refetch, isLoading } = useListConfiguration();
  const { createListConfig, updateListConfig } = useListConfigurationMutation();

  const onCancel = useCallback(async () => {
    history.push(LIST_CONFIGURATION_BASE_PATH);
  }, [history]);

  const onMutationSuccess = useCallback(() => {
    onCancel();
    refetch();
    showCallout({ messageId: 'ui-orders.settings.routing.listConfiguration.update.success' });
  }, [onCancel, refetch, showCallout]);

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

  if (isLoading) {
    return <LoadingPane paneTitle={label} />;
  }

  return (
    <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.routing.listConfiguration' })}>
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
    </TitleManager>
  );
};

RoutingListConfiguration.propTypes = {
  label: PropTypes.object.isRequired,
};

export default RoutingListConfiguration;
