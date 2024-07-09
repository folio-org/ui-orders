import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useStripes } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  InfoPopover,
  Loading,
  Modal,
  ModalFooter,
  Row,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  useCentralOrderingContext,
} from '@folio/stripes-acq-components';

import { ConsortiumRelatedItemsList } from '../ConsortiumRelatedItemsList';
import { RelatedItemsList } from '../RelatedItemsList';
import { checkIfSubmitActionProhibited } from '../utils';

const ChangeInstanceModal = ({
  detailed,
  handleSubmit,
  isLoading,
  onCancel,
  poLine,
  pristine,
  selectedInstance,
  submitting,
  updateHoldingsOptions,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const isConfirmDisabled = isLoading
    || (detailed && (pristine || submitting))
    || checkIfSubmitActionProhibited(stripes, poLine);

  const modalLabel = intl.formatMessage({ id: 'ui-orders.line.changeInstance.heading' });

  const message = useMemo(() => (
    intl.formatMessage(
      { id: `ui-orders.line.changeInstance.${detailed ? 'detailedMessage' : 'message'}` },
      {
        from: (
          <Link to={`/inventory/view/${poLine.instanceId}`}>
            {poLine.titleOrPackage}
          </Link>
        ),
        to: (
          <Link to={`/inventory/view/${selectedInstance.id}`}>
            {selectedInstance.title}
          </Link>
        ),
      },
    )
  ), [detailed, intl, poLine, selectedInstance]);

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        disabled={isConfirmDisabled}
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id={`ui-orders.${detailed ? 'buttons.line.submit' : 'line.changeInstance.confirmLabel'}`} />
      </Button>

      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-orders.buttons.line.cancel" />
      </Button>
    </ModalFooter>
  );

  const RelatedItemsListComponent = isCentralOrderingEnabled
    ? ConsortiumRelatedItemsList
    : RelatedItemsList;

  const modalContent = useMemo(() => (
    <>
      <span>{message}</span>
      {detailed && (
        <>
          <hr />
          <form>
            <Row>
              <Col xs={4}>
                <FieldSelectFinal
                  label={<FormattedMessage id="ui-orders.line.changeInstance.holdingOperations.field" />}
                  name="holdingsOperation"
                  dataOptions={updateHoldingsOptions}
                  required
                />
              </Col>
              <InfoPopover
                content={<FormattedMessage id="ui-orders.line.changeInstance.holdingOperations.info" />}
                iconSize="medium"
                placement="right"
              />
            </Row>
          </form>

          <Row>
            <Col xs>
              <RelatedItemsListComponent poLine={poLine} />
            </Col>
          </Row>
        </>
      )}
    </>
  ), [
    detailed,
    message,
    poLine,
    updateHoldingsOptions,
  ]);

  return (
    <Modal
      aria-label={modalLabel}
      footer={footer}
      id="changing-instance-confirmation"
      label={modalLabel}
      size={detailed ? 'medium' : 'small'}
      open
    >
      {isLoading ? <Loading /> : modalContent}
    </Modal>
  );
};

ChangeInstanceModal.propTypes = {
  detailed: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  poLine: PropTypes.object.isRequired,
  pristine: PropTypes.bool,
  selectedInstance: PropTypes.object.isRequired,
  submitting: PropTypes.bool,
  updateHoldingsOptions: PropTypes.arrayOf(PropTypes.object),
};

export default stripesForm({
  subscription: { values: true },
})(ChangeInstanceModal);
