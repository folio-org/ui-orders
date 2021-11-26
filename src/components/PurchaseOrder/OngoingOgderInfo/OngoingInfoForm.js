import React from 'react';
import { useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
} from '@folio/stripes/components';

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
import { VisibilityControl } from '../../../common/VisibilityControl';
import { isWorkflowStatusIsPending } from '../util';

const OngoingInfoForm = () => {
  const { values } = useFormState();
  const ongoingFormValues = values.ongoing;
  const disabled = !isOngoing(values.orderType);
  const isSubscription = !!ongoingFormValues?.isSubscription;
  const isNonInteractive = values.workflowStatus && !isWorkflowStatusIsPending(values);

  if (isNonInteractive && disabled) return null;

  return (
    <Accordion
      id="ongoing"
      label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
    >
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <VisibilityControl name="hiddenFields.ongoing.isSubscription">
            <FieldRenewalSubscription
              disabled={disabled}
              isNonInteractive={isNonInteractive}
            />
          </VisibilityControl>
        </Col>
        {!disabled && (
          <>
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.ongoing.interval">
                <FieldRenewalInterval
                  disabled={!isSubscription}
                  isNonInteractive={isNonInteractive}
                />
              </VisibilityControl>
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.ongoing.renewalDate">
                <FieldRenewalDate
                  disabled={!isSubscription}
                  isNonInteractive={isNonInteractive}
                />
              </VisibilityControl>
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.ongoing.reviewPeriod">
                <FieldRenewalPeriod
                  disabled={!isSubscription}
                  isNonInteractive={isNonInteractive}
                />
              </VisibilityControl>
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.ongoing.manualRenewal">
                <FieldIsManualRenewal
                  disabled={!isSubscription}
                  isNonInteractive={isNonInteractive}
                />
              </VisibilityControl>
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.ongoing.reviewDate">
                <FieldReviewDate
                  disabled={isSubscription}
                  isNonInteractive={isNonInteractive}
                />
              </VisibilityControl>
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.ongoing.notes">
                <FieldOngoingInfoNotes
                  isNonInteractive={isNonInteractive}
                />
              </VisibilityControl>
            </Col>
          </>
        )}
      </Row>
    </Accordion>
  );
};

export default OngoingInfoForm;
