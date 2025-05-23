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
import {
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY,
} from '../../common/constants';

const CentralOrderingForm = ({
  handleSubmit,
  pristine,
  submitting,
}) => {
  const intl = useIntl();
  const paneTitleRef = useRef();
  const stripes = useStripes();

  const handlePaneFocus = useCallback(() => {
    return paneTitleRef.current?.focus();
  }, []);

  const paneFooter = useMemo(() => {
    const end = (
      <Button
        id="clickable-save-central-ordering-footer"
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
      paneTitle={<FormattedMessage id="ui-orders.settings.centralOrdering.label" />}
    />
  );

  const dataOptions = useMemo(() => {
    return Object.entries(CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH)
      .map(([key, value]) => ({
        labelId: `ui-orders.settings.centralOrdering.receivingSearch.${key}`,
        value,
      }));
  }, []);

  return (
    <Pane
      defaultWidth="fill"
      id="central-ordering"
      renderHeader={renderHeader}
      paneTitleRef={paneTitleRef}
      footer={paneFooter}
      onMount={handlePaneFocus}
    >
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.centralOrdering.label' })} />
      <Row>
        <Col xs={12}>
          <FieldSelectFinal
            dataOptions={dataOptions}
            fullWidth
            label={<FormattedMessage id="ui-orders.settings.centralOrdering.receivingSearch.label" />}
            name={CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY}
            disabled={!stripes.hasPerm('ui-orders.settings.all')}
            required
          />
        </Col>
      </Row>
    </Pane>
  );
};

CentralOrderingForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(CentralOrderingForm);
