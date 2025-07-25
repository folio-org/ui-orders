import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';
import {
  IfFieldVisible,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import { PO_FORM_FIELDS } from '../../../common/constants';
import {
  FieldRenewalInterval,
  FieldRenewalDate,
  FieldRenewalPeriod,
  FieldIsManualRenewal,
  FieldRenewalSubscription,
  FieldReviewDate,
  FieldOngoingInfoNotes,
  isOngoing,
} from '../../../common/POFields';
import { ACCORDION_ID } from '../constants';
import {
  isWorkflowStatusIsPending,
  isWorkflowStatusClosed,
} from '../util';

const OngoingInfoForm = ({ hiddenFields = {} }) => {
  const { values } = useFormState();
  const ongoingFormValues = values.ongoing;
  const disabled = !isOngoing(values.orderType);
  const isSubscription = !!ongoingFormValues?.isSubscription;
  const isClosedNonInteractive = values.workflowStatus && isWorkflowStatusClosed(values);
  const isNonPendingNonInteractive = values.workflowStatus && !isWorkflowStatusIsPending(values);

  if (isClosedNonInteractive && disabled) return null;

  return (
    <Accordion
      id={ACCORDION_ID.ongoing}
      label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
    >
      <Row>
        <IfFieldVisible
          visible={!hiddenFields.ongoing?.isSubscription}
          name={PO_FORM_FIELDS.isSubscription}
        >
          <Col
            xs={6}
            md={3}
          >
            <VisibilityControl name="hiddenFields.ongoing.isSubscription">
              <FieldRenewalSubscription
                disabled={disabled}
                isNonInteractive={isNonPendingNonInteractive}
              />
            </VisibilityControl>
          </Col>
        </IfFieldVisible>
        {!disabled && (
          <>
            <IfFieldVisible
              visible={!hiddenFields.ongoing?.interval}
              name={PO_FORM_FIELDS.ongoingInterval}
            >
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.ongoing.interval">
                  <FieldRenewalInterval
                    disabled={!isSubscription}
                    isNonInteractive={isClosedNonInteractive}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible
              visible={!hiddenFields.ongoing?.renewalDate}
              name={PO_FORM_FIELDS.renewalDate}
            >
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.ongoing.renewalDate">
                  <FieldRenewalDate
                    disabled={!isSubscription}
                    isNonInteractive={isClosedNonInteractive}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible
              visible={!hiddenFields.ongoing?.reviewPeriod}
              name={PO_FORM_FIELDS.reviewPeriod}
            >
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.ongoing.reviewPeriod">
                  <FieldRenewalPeriod
                    disabled={!isSubscription}
                    isNonInteractive={isClosedNonInteractive}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible
              visible={!hiddenFields.ongoing?.manualRenewal}
              name={PO_FORM_FIELDS.manualRenewal}
            >
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.ongoing.manualRenewal">
                  <FieldIsManualRenewal
                    disabled={!isSubscription}
                    isNonInteractive={isNonPendingNonInteractive}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible
              visible={!hiddenFields.ongoing?.reviewDate}
              name={PO_FORM_FIELDS.reviewDate}
            >
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.ongoing.reviewDate">
                  <FieldReviewDate
                    disabled={isSubscription}
                    isNonInteractive={isClosedNonInteractive}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>

            <IfFieldVisible
              visible={!hiddenFields.ongoing?.notes}
              name={PO_FORM_FIELDS.ongoingNotes}
            >
              <Col
                xs={6}
                md={3}
              >
                <VisibilityControl name="hiddenFields.ongoing.notes">
                  <FieldOngoingInfoNotes
                    isNonInteractive={isClosedNonInteractive}
                  />
                </VisibilityControl>
              </Col>
            </IfFieldVisible>
          </>
        )}
      </Row>
    </Accordion>
  );
};

OngoingInfoForm.propTypes = {
  hiddenFields: PropTypes.object,
};

export default OngoingInfoForm;
