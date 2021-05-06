import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  batchRequest,
  LIMIT_MAX,
  LINES_API,
} from '@folio/stripes-acq-components';

import {
  formatContributors,
  formatPublishers,
  formatRelations,
} from './formatters';

export const hydrateLinkedInstance = (instance, relationTypes) => {
  return {
    id: instance.id,
    title: instance.title,
    contributors: formatContributors(instance?.contributors),
    publishers: formatPublishers(instance?.publication),
    relations: formatRelations(instance?.parentInstances, instance?.childInstances, relationTypes),
  };
};

export const useInstanceRelationTypes = () => {
  const ky = useOkapiKy();

  const { refetch } = useQuery(
    ['ui-orders', 'linked-lines'],
    () => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: 'cql.allRecords=1',
      };

      return ky.get('instance-relationship-types', { searchParams }).json();
    },
    { enabled: false },
  );

  return { fetchInstanceRelationTypes: refetch };
};

export const useLinkedLines = line => {
  const ky = useOkapiKy();

  const { isLoading, data } = useQuery(
    ['ui-orders', 'linked-lines', line.id],
    () => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: `packagePoLineId=${line.id} and instanceId=""`,
      };

      return ky.get(LINES_API, { searchParams }).json();
    },
    { enabled: Boolean(line.isPackage) },
  );

  return {
    isLoading,
    linkedLines: data?.poLines,
  };
};

export const useLinkedInstances = line => {
  const { fetchInstanceRelationTypes } = useInstanceRelationTypes();
  const { isLoading: isLinkedLinesLoading, linkedLines = [] } = useLinkedLines(line);
  const ky = useOkapiKy();

  const linkedInstanceIds = linkedLines
    .map(({ instanceId }) => instanceId)
    .filter(Boolean);

  if (line.instanceId && !line.isPackage) {
    linkedInstanceIds.push(line.instanceId);
  }

  const { isLoading, data } = useQuery(
    ['ui-orders', 'linked-instances', line.id, linkedInstanceIds],
    async () => {
      const { data: relationTypesData } = await fetchInstanceRelationTypes();

      return batchRequest(
        async ({ params: searchParams }) => {
          const { instances = [] } = await ky.get('inventory/instances', { searchParams }).json();

          return instances.map(
            instance => hydrateLinkedInstance(instance, relationTypesData?.instanceRelationshipTypes),
          );
        },
        linkedInstanceIds,
      );
    },
    { enabled: Boolean(linkedInstanceIds.length) },
  );

  return {
    isLoading: isLoading || isLinkedLinesLoading,
    linkedInstances: data,
  };
};
