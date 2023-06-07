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
  FieldRenewalInterval,
  FieldRenewalDate,
  FieldRenewalPeriod,
  FieldIsManualRenewal,
  FieldRenewalSubscription,
  FieldReviewDate,
  FieldOngoingInfoNotes,
  isOngoing,
} from '../../../common/POFields';
import { IfFieldVisible } from '../../../common/IfFieldVisible';
import { VisibilityControl } from '../../../common/VisibilityControl';
import { ACCORDION_ID } from '../constants';
import { isWorkflowStatusClosed } from '../util';

const OngoingInfoForm = ({ hiddenFields = {} }) => {
  const { values } = useFormState();
  const ongoingFormValues = values.ongoing;
  const disabled = !isOngoing(values.orderType);
  const isSubscription = !!ongoingFormValues?.isSubscription;
  const isNonInteractive = values.workflowStatus && isWorkflowStatusClosed(values);

  if (isNonInteractive && disabled) return null;

  return (
    <Accordion
      id={ACCORDION_ID.ongoing}
      label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
    >
      <Row>
        <IfFieldVisible visible={!hiddenFields.ongoing?.isSubscription} name="ongoing.isSubscription">
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
        </IfFieldVisible>
        {!disabled && (
          <>
            <IfFieldVisible visible={!hiddenFields.ongoing?.interval} name="ongoing.interval">
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
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.ongoing?.renewalDate} name="ongoing.renewalDate">
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
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.ongoing?.reviewPeriod} name="ongoing.reviewPeriod">
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
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.ongoing?.manualRenewal} name="ongoing.manualRenewal">
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
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.ongoing?.reviewDate} name="ongoing.reviewDate">
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
            </IfFieldVisible>

            <IfFieldVisible visible={!hiddenFields.ongoing?.notes} name="ongoing.notes">
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
