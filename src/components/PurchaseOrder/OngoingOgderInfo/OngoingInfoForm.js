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
          <FieldRenewalSubscription
            disabled={disabled}
            isNonInteractive={isNonInteractive}
          />
        </Col>
        {!disabled && (
          <>
            <Col
              xs={6}
              md={3}
            >
              <FieldRenewalInterval
                disabled={!isSubscription}
                isNonInteractive={isNonInteractive && ongoingFormValues?.interval}
              />
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <FieldRenewalDate
                disabled={!isSubscription}
                isNonInteractive={isNonInteractive && ongoingFormValues?.renewalDate}
              />
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <FieldRenewalPeriod
                disabled={!isSubscription}
                isNonInteractive={isNonInteractive && ongoingFormValues?.reviewPeriod}
              />
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <FieldIsManualRenewal
                disabled={!isSubscription}
                isNonInteractive={isNonInteractive}
              />
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <FieldReviewDate
                disabled={isSubscription}
                isNonInteractive={isNonInteractive && ongoingFormValues?.reviewDate}
              />
            </Col>
            <Col
              xs={6}
              md={3}
            >
              <FieldOngoingInfoNotes
                isNonInteractive={isNonInteractive && ongoingFormValues?.notes}
              />
            </Col>
          </>
        )}
      </Row>
    </Accordion>
  );
};

export default OngoingInfoForm;
