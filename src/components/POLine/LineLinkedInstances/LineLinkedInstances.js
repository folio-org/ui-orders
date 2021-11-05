import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Loading,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { ACCORDION_ID } from '../const';

import { useLinkedInstances } from './useLinkedInstances';

const visibleColumns = ['title', 'contributors', 'publishers', 'relations'];
const columnMapping = {
  title: <FormattedMessage id="ui-orders.instance.title" />,
  contributors: <FormattedMessage id="ui-orders.instance.contributors" />,
  publishers: <FormattedMessage id="ui-orders.instance.publishers" />,
  relations: <FormattedMessage id="ui-orders.instance.relations" />,
};
const columnWidths = {
  title: '50%',
};
const resultFormatter = {
  title: instance => (
    <Link to={`/inventory/view/${instance.id}`}>
      {instance.title}
    </Link>
  ),
  contributors: instance => instance.contributors || <NoValue />,
  publishers: instance => instance.publishers || <NoValue />,
  relations: instance => instance.relations || <NoValue />,
};

export const LineLinkedInstances = ({ line, toggleSection }) => {
  const intl = useIntl();
  const { isLoading, linkedInstances } = useLinkedInstances(line);

  useEffect(() => {
    toggleSection({ id: ACCORDION_ID.linkedInstances, isOpened: Boolean(isLoading || linkedInstances?.length) });
  }, [toggleSection, isLoading, linkedInstances]);

  return (
    <Accordion
      label={intl.formatMessage({ id: 'ui-orders.line.accordion.linkedInstances' })}
      id={ACCORDION_ID.linkedInstances}
    >
      {
        isLoading
          ? <Loading size="medium" />
          : (
            <MultiColumnList
              id="lineLinkedInstances"
              contentData={linkedInstances}
              visibleColumns={visibleColumns}
              columnMapping={columnMapping}
              columnWidths={columnWidths}
              formatter={resultFormatter}
              interactive={false}
            />
          )
      }
    </Accordion>
  );
};

LineLinkedInstances.propTypes = {
  line: PropTypes.object.isRequired,
  toggleSection: PropTypes.func.isRequired,
};
