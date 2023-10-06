import React, { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Col,
  MessageBanner,
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
import { ACCOUNT_STATUS } from '../const';

const { ACTIVE, INACTIVE } = ACCOUNT_STATUS;

const VendorForm = ({
  order,
  accounts = [],
  hiddenFields = {},
  integrationConfigs = [],
}) => {
  const { formatMessage } = useIntl();
  const { change, getState } = useForm();
  const { vendorDetail } = getState().values;
  const currentAccountNumber = vendorDetail?.vendorAccount;
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const initialAccountNumber = useRef(currentAccountNumber);

  const activeAccountOptions = useMemo(() => {
    const message = ` - ${formatMessage({ id: 'ui-orders.inactive' })}`;
    const activeAccounts = accounts.filter(({ accountStatus, accountNo }) => {
      return accountStatus === ACTIVE || accountNo === initialAccountNumber.current;
    });

    return activeAccounts.map(({ name, accountNo, accountStatus }) => ({
      label: `${name} (${accountNo}) ${accountStatus === INACTIVE ? message : ''}`,
      value: accountNo,
    }));
  }, [accounts, formatMessage]);

  const onAccountChange = useCallback(
    ({ target: { value } }) => {
      change('vendorDetail.vendorAccount', value);
      const acquisitionMethod = getState().values?.acquisitionMethod;

      toggleAutomaticExport({ vendorAccount: value, acquisitionMethod, integrationConfigs, change });
    }, [change, getState, integrationConfigs],
  );

  const accountNumberDisabled = useMemo(() => {
    const hasCurrentAccountNumber = accounts.some(({ accountNo }) => accountNo === currentAccountNumber);
    const isOnlyOneActiveAccount = activeAccountOptions.length === 1;
    const noActiveAccounts = activeAccountOptions.length === 0;

    return noActiveAccounts || (hasCurrentAccountNumber && isOnlyOneActiveAccount);
  }, [accounts, activeAccountOptions, currentAccountNumber]);

  const isSelectedAccountInactive = useMemo(() => {
    return accounts.some(({ accountNo, accountStatus }) => {
      return accountNo === currentAccountNumber && accountStatus === INACTIVE;
    });
  }, [accounts, currentAccountNumber]);

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
              accounts={activeAccountOptions}
              disabled={isPostPendingOrder || accountNumberDisabled}
              onChange={onAccountChange}
            />
            {
              isSelectedAccountInactive && (
                <MessageBanner type="warning">
                  <FormattedMessage id="ui-orders.vendor.accountNumber.inActive" />
                </MessageBanner>
              )
            }
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
