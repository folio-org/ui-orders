import { FormattedMessage } from 'react-intl';

import { LoadingPane } from '@folio/stripes/components';
import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';
import { useCentralOrderingSettings } from '@folio/stripes-acq-components';

import { useSettingsSections } from './hooks';
import {
  NETWORK_ORDERING_SECTION,
  SECTIONS,
} from './sections';

const paneTitle = <FormattedMessage id="ui-orders.settings.index.paneTitle" />;

const OrdersSettings = (props) => {
  const stripes = useStripes();
  const [namespace] = useNamespace('orders-settings');

  const {
    key,
    insertSection,
    sections,
  } = useSettingsSections(SECTIONS);

  const { isLoading: isCentralOrderingSettingsLoading } = useCentralOrderingSettings({
    enabled: stripes.hasInterface('consortia'),
    queryKey: [namespace],
    onSuccess: (d) => {
      if (d?.value === 'true') {
        insertSection(NETWORK_ORDERING_SECTION);
      }
    },
  });

  if (isCentralOrderingSettingsLoading) {
    return (
      <LoadingPane
        paneTitle={paneTitle}
        defaultWidth="30%"
      />
    );
  }

  return (
    <Settings
      key={key}
      {...props}
      sections={sections}
      paneTitle={paneTitle}
    />
  );
};

export default OrdersSettings;
