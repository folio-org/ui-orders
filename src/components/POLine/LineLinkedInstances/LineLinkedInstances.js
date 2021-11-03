import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  Loading,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  ERROR_CODE_GENERIC,
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { ACCORDION_ID } from '../const';

import InstancePlugin from '../Item/InstancePlugin';
import {
  useLinkedInstances,
  useTitleMutation,
} from './hooks';
import { getTitle } from './utils';

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
  title: (instance) => (
    <Link to={`/inventory/view/${instance.id}`}>
      {instance.title}
    </Link>
  ),
  contributors: ({ contributors }) => contributors || <NoValue />,
  publishers: ({ publishers }) => publishers || <NoValue />,
  relations: ({ relations }) => relations || <NoValue />,
};

export const LineLinkedInstances = ({ line, toggleSection, labelId }) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const { isLoading, linkedInstances, refetch } = useLinkedInstances(line);
  const { mutateTitle } = useTitleMutation();

  useEffect(() => {
    toggleSection({ id: ACCORDION_ID.linkedInstances, isOpened: Boolean(isLoading || linkedInstances?.length) });
  }, [toggleSection, isLoading, linkedInstances]);

  const onAddInstance = useCallback((instance) => {
    const title = getTitle(instance, line.id);

    return mutateTitle(title)
      .then(() => {
        showCallout({
          messageId: 'ui-orders.title.actions.save.success',
          values: { title: title.title, poLineNumber: line.poLineNumber },
        });
        refetch();
      }, (async ({ response }) => {
        const errorCode = await getErrorCodeFromResponse(response);
        const values = {
          title: <b>{title.title}</b>,
          poLineNumber: <b>{line.poLineNumber}</b>,
        };
        const message = (
          <FormattedMessage
            id={`ui-orders.title.actions.save.error.${errorCode}`}
            defaultMessage={intl.formatMessage({ id: `ui-orders.title.actions.save.error.${ERROR_CODE_GENERIC}` }, values)}
            values={values}
          />
        );

        showCallout({
          message,
          type: 'error',
        });
      }));
  }, [intl, line.id, line.poLineNumber, mutateTitle, refetch, showCallout]);

  const addTitleButton = (
    <IfPermission perm="orders.titles.item.post">
      <InstancePlugin
        addInstance={onAddInstance}
        searchButtonStyle="default"
        searchLabelId="ui-orders.title.actions.add"
        disabled={isLoading}
      />
    </IfPermission>

  );

  return (
    <Accordion
      label={intl.formatMessage({ id: labelId })}
      id={ACCORDION_ID.linkedInstances}
      displayWhenOpen={line.isPackage ? addTitleButton : null}
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
  labelId: PropTypes.string.isRequired,
};
