/* eslint-disable filenames/match-exported */
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AppContextMenu,
  checkIfUserInCentralTenant,
  stripesShape,
} from '@folio/stripes/core';
import {
  checkScope,
  CommandList,
  defaultKeyboardShortcuts,
  HasCommand,
  NavList,
  NavListItem,
  NavListSection,
} from '@folio/stripes/components';
import {
  AcqKeyboardShortcutsModal,
  ConsortiumLocationsContextProvider,
  handleKeyCommand,
  LocationsContextProvider as TenantLocationsContextProvider,
  useCentralOrderingSettings,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { LayerPO, LayerPOLine } from './components/LayerCollection';
import OrdersList from './OrdersList';
import OrderLinesList from './OrderLinesList';
import OrdersSettings from './settings/OrdersSettings';
import {
  NOTES_ROUTE,
  ORDER_CREATE_ROUTE,
  ORDER_EDIT_ROUTE,
  ORDER_LINE_CREATE_ROUTE,
  ORDER_LINE_EDIT_ROUTE,
  ORDER_LINES_ROUTE,
  ROUTING_LIST_ROUTE,
} from './common/constants';
import { Notes } from './common/Notes';
import { RoutingList } from './components/POLine';

const Orders = ({
  match,
  location,
  showSettings,
  stripes,
}) => {
  const [isOpen, toggleModal] = useModalToggle();

  const { enabled: isCentralOrderingEnabled } = useCentralOrderingSettings({
    enabled: checkIfUserInCentralTenant(stripes),
  });

  const focusSearchField = () => {
    const el = document.getElementById('input-record-search');

    if (el) {
      el.focus();
    }
  };

  const LocationsContextProvider = isCentralOrderingEnabled
    ? ConsortiumLocationsContextProvider
    : TenantLocationsContextProvider;

  const shortcuts = [
    {
      name: 'search',
      handler: handleKeyCommand(focusSearchField),
    },
    {
      name: 'openShortcutModal',
      shortcut: 'mod+alt+k',
      handler: handleKeyCommand(toggleModal),
    },
  ];

  const orderCommands = [
    {
      name: 'duplicateRecord',
      label: <FormattedMessage id="ui-orders.shortcut.duplicateRecord" />,
      shortcut: 'alt+c',
    },
    {
      name: 'addPOL',
      label: <FormattedMessage id="ui-orders.shortcut.addPOL" />,
      shortcut: 'alt+a',
    },
  ];

  const { path } = match;
  const content = showSettings
    ? (
      <CommandList commands={defaultKeyboardShortcuts}>
        <OrdersSettings {...{ match, location }} />
      </CommandList>
    )
    : (
      <>
        <CommandList commands={defaultKeyboardShortcuts}>
          <HasCommand
            commands={shortcuts}
            isWithinScope={checkScope}
            scope={document.body}
          >
            <AppContextMenu>
              {handleToggle => (
                <NavList>
                  <NavListSection>
                    <NavListItem
                      id="orders-app-search-item"
                      to={{
                        pathname: ORDER_LINES_ROUTE,
                        state: { resetFilters: true },
                      }}
                      onClick={() => {
                        handleToggle();
                        focusSearchField();
                      }}
                    >
                      <FormattedMessage id="ui-orders.appMenu.ordersAppSearch" />
                    </NavListItem>
                    <NavListItem
                      id="keyboard-shortcuts-item"
                      onClick={() => {
                        handleToggle();
                        toggleModal();
                      }}
                    >
                      <FormattedMessage id="stripes-acq-components.appMenu.keyboardShortcuts" />
                    </NavListItem>
                  </NavListSection>
                </NavList>
              )}
            </AppContextMenu>
            <LocationsContextProvider>
              <Switch>
                <Route
                  path={ROUTING_LIST_ROUTE}
                  component={RoutingList}
                />
                <Route
                  path={ORDER_LINE_CREATE_ROUTE}
                  component={LayerPOLine}
                />
                <Route
                  path={ORDER_LINE_EDIT_ROUTE}
                  component={LayerPOLine}
                />
                <Route
                  path={ORDER_CREATE_ROUTE}
                  component={LayerPO}
                />
                <Route
                  path={ORDER_EDIT_ROUTE}
                  component={LayerPO}
                />
                <Route
                  path={ORDER_LINES_ROUTE}
                  component={OrderLinesList}
                />
                <Route
                  path={NOTES_ROUTE}
                  component={Notes}
                />
                <Route
                  path={path}
                  component={OrdersList}
                />
              </Switch>
            </LocationsContextProvider>
          </HasCommand>
        </CommandList>
        {isOpen && (
          <AcqKeyboardShortcutsModal
            commands={orderCommands}
            onClose={toggleModal}
          />
        )}
      </>
    );

  return content;
};

Orders.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool,
  stripes: stripesShape.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default Orders;
