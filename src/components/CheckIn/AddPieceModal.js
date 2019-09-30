import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';
import { includes } from 'lodash';

import {
  Button,
  Checkbox,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';
import {
  FieldDatepicker,
  FieldSelect,
  validateRequired,
} from '@folio/stripes-acq-components';

import { INVENTORY_RECORDS_TYPE } from '../POLine/const';
import { ADD_PIECE_MODAL_FORM } from './const';
import FieldPieceFormat from './FieldPieceFormat';

const footer = (close, save, checkIn) => (
  <ModalFooter>
    <Button
      buttonStyle="primary"
      data-test-add-piece-save
      onClick={save}
    >
      <FormattedMessage id="ui-orders.checkIn.buttons.save" />
    </Button>
    <Button
      buttonStyle="primary"
      data-test-add-piece-check-in
      onClick={checkIn}
    >
      <FormattedMessage id="ui-orders.checkIn.buttons.checkIn" />
    </Button>
    <Button
      data-test-add-piece-cancel
      onClick={close}
    >
      <FormattedMessage id="ui-orders.checkIn.buttons.cancel" />
    </Button>
  </ModalFooter>
);

class AddPieceModal extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    createInventoryValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    stripes: PropTypes.object.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    showPieceFormatField: PropTypes.bool,
    instanceId: PropTypes.string,
    dispatch: PropTypes.func,
    change: PropTypes.func,
    formValues: PropTypes.object,
  }

  onAddItem = (item = {}) => {
    const { dispatch, change } = this.props;

    if (item.id) {
      dispatch(change('itemId', item.id));
    }
  }

  render() {
    const {
      checkIn,
      close,
      createInventoryValues,
      handleSubmit,
      locations = [],
      showPieceFormatField = false,
      stripes,
      instanceId,
      formValues = {},
    } = this.props;
    const { format, id, itemId, locationId } = formValues;
    const isLocationRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.instanceAndHolding);
    const isAddItemRequired = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.all);
    let isAddItemButtonDisabled = true;

    if (!itemId && locationId && isAddItemRequired) {
      isAddItemButtonDisabled = false;
    }

    const disabledButtonProps = isAddItemButtonDisabled ? { disabled: isAddItemButtonDisabled } : {};
    const labelId = id ? 'ui-orders.checkIn.addPieceModal.editTitle' : 'ui-orders.checkIn.addPieceModal.title';

    return (
      <Modal
        enforceFocus={false}
        footer={footer(close, handleSubmit, checkIn)}
        id="add-piece-modal"
        label={<FormattedMessage id={labelId} />}
        open
      >
        <form>
          <Row>
            <Col xs={6}>
              <Field
                component={TextField}
                fullWidth
                label={<FormattedMessage id="ui-orders.checkIn.caption" />}
                name="caption"
                required
                type="text"
                validate={validateRequired}
              />
            </Col>
            {showPieceFormatField && (
              <Col xs>
                <FieldPieceFormat />
              </Col>
            )}
          </Row>
          <Row>
            <Col xs>
              <FieldDatepicker
                labelId="ui-orders.checkIn.expectedReceiptDate"
                name="receivedDate"
                required
                validate={validateRequired}
              />
            </Col>
            <Col xs>
              <Field
                component={TextArea}
                fullWidth
                label={<FormattedMessage id="ui-orders.checkIn.comment" />}
                name="comment"
              />
            </Col>
          </Row>
          <Row>
            <Col xs>
              <FieldSelect
                dataOptions={locations}
                fullWidth
                label={<FormattedMessage id="ui-orders.checkIn.location" />}
                name="locationId"
                required={isLocationRequired}
              />
            </Col>
            <Col xs>
              <Field
                component={Checkbox}
                fullWidth
                label={<FormattedMessage id="ui-orders.checkIn.supplement" />}
                name="supplement"
                type="checkbox"
                vertical
              />
            </Col>
          </Row>
          <Row>
            <Col xs>
              <Pluggable
                disabled={isAddItemButtonDisabled}
                aria-haspopup="true"
                instanceId={instanceId}
                locationId={locationId}
                searchButtonStyle="default"
                searchLabel={<FormattedMessage id="ui-orders.checkIn.buttons.addItem" />}
                stripes={stripes}
                type="create-item"
                addItem={this.onAddItem}
              >
                <span
                  data-test-add-item
                  {...disabledButtonProps}
                >
                  <FormattedMessage id="ui-orders.errors.noCreateItemPlugin" />
                </span>
              </Pluggable>
            </Col>
          </Row>
        </form>
      </Modal>
    );
  }
}

export default stripesForm({
  form: ADD_PIECE_MODAL_FORM,
})(AddPieceModal);
