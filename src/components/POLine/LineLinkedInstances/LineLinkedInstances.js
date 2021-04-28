import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';

import { ACCORDION_ID } from '../const';

import { useLinkedInstances } from './useLinkedInstances';

const visibleColumns = ['title'];

export const LineLinkedInstances = ({ line }) => {
  const intl = useIntl();
  const { isLoading, linkedInstances } = useLinkedInstances(line);

  return (
    <Accordion
      label={intl.formatMessage({ id: 'ui-orders.line.accordion.linkedInstances' })}
      id={ACCORDION_ID.relatedInvoices}
    >
      {
        isLoading
          ? <Loading size="medium" />
          : (
            <MultiColumnList
              id="lineLinkedInstances"
              contentData={linkedInstances}
              visibleColumns={visibleColumns}
              interactive={false}
            />
          )
      }
    </Accordion>
  );
};

LineLinkedInstances.propTypes = {
  line: PropTypes.object.isRequired,
};
