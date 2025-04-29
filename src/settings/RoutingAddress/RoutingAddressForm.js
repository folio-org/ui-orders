import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Col,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import { ROUTING_USER_ADDRESS_TYPE_ID } from './constants';

const RoutingAddressForm = ({
  handleSubmit,
  pristine,
  submitting,
  addressTypeOptions,
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();

  const handlePaneFocus = useCallback(() => {
    return paneTitleRef.current?.focus();
  }, []);

  const paneFooter = useMemo(() => {
    const end = (
      <Button
        id="clickable-save-routing-address-footer"
        type="submit"
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        onClick={handleSubmit}
        marginBottom0
      >
        <FormattedMessage id="stripes-core.button.save" />
      </Button>
    );

    return <PaneFooter renderEnd={end} />;
  }, [handleSubmit, pristine, submitting]);

  const renderHeader = (renderProps) => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="ui-orders.settings.routing.address" />}
    />
  );

  return (
    <Pane
      defaultWidth="fill"
      id="central-ordering"
      renderHeader={renderHeader}
      paneTitleRef={paneTitleRef}
      footer={paneFooter}
      onMount={handlePaneFocus}
    >
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.routing.address' })} />
      <Row>
        <Col xs={12}>
          <FieldSelectFinal
            dataOptions={addressTypeOptions}
            fullWidth
            label={<FormattedMessage id="ui-orders.settings.addressTypes.select.label" />}
            name={ROUTING_USER_ADDRESS_TYPE_ID}
            required
          />
        </Col>
      </Row>
    </Pane>
  );
};

RoutingAddressForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  addressTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(RoutingAddressForm);
