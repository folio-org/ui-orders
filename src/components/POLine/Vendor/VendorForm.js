import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { VendorReferenceNumbersFields } from '@folio/stripes-acq-components';

import {
  FieldVendorInstructions,
  FieldVendorAccountNumber,
} from '../../../common/POLFields';
import { IfFieldVisible } from '../../../common/IfFieldVisible';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import { toggleAutomaticExport } from '../../Utils/toggleAutomaticExport';

const VendorForm = ({
  order,
  accounts = [],
  hiddenFields = {},
  integrationConfigs = [],
}) => {
  const { change, getState } = useForm();
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const accountsDataOptions = accounts.map(({ name, accountNo }) => ({
    label: `${name} (${accountNo})`,
    value: accountNo,
  }));

  const onAccountChange = useCallback(
    ({ target: { value } }) => {
      change('vendorDetail.vendorAccount', value);
      const acquisitionMethod = getState().values?.acquisitionMethod;

      toggleAutomaticExport({ vendorAccount: value, acquisitionMethod, integrationConfigs, change });
    }, [change, getState, integrationConfigs],
  );

  return (
    <>
      <VendorReferenceNumbersFields
        fieldName="vendorDetail.referenceNumbers"
      />
      <Row>
        <IfFieldVisible visible={!hiddenFields.vendorDetail?.vendorAccount} name="vendorDetail.vendorAccount">
          <Col
            xs={6}
            md={3}
          >
            <FieldVendorAccountNumber
              accounts={accountsDataOptions}
              disabled={isPostPendingOrder}
              onChange={onAccountChange}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.vendorDetail?.instructions} name="vendorDetail.instructions">
          <Col
            xs={6}
            md={3}
          >
            <FieldVendorInstructions disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>
      </Row>
    </>
  );
};

VendorForm.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
  hiddenFields: PropTypes.object,
  integrationConfigs: PropTypes.arrayOf(PropTypes.object),
};

export default VendorForm;
