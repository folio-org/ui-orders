import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Pane,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

const POLinesLimitForm = props => {
  const {
    children,
    handleSubmit,
    pristine,
    saveButtonText,
    submitting,
    title,
  } = props;

  const lastMenu = (
    <Button
      buttonStyle="primary paneHeaderNewButton"
      disabled={(pristine || submitting)}
      id="set-polines-limit-submit-btn"
      marginBottom0
      type="submit"
    >
      {saveButtonText}
    </Button>
  );

  return (
    <form id="po-lines-limit-form" onSubmit={handleSubmit}>
      <Pane
        defaultWidth="100%"
        fluidContentWidth
        lastMenu={lastMenu}
        paneTitle={title}
      >
        {children}
      </Pane>
    </form>
  );
};

POLinesLimitForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  title: PropTypes.object,
  saveButtonText: PropTypes.object,
  children: PropTypes.node,
};

export default stripesForm({
  form: 'poLinesLimitForm',
  navigationCheck: true,
  enableReinitialize: true,
})(POLinesLimitForm);
