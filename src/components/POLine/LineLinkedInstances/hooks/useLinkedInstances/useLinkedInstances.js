import { useQuery } from 'react-query';
import { keyBy, uniq } from 'lodash/fp';

import { useOkapiKy } from '@folio/stripes/core';
import {
  batchRequest,
  LIMIT_MAX,
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

export const useLinkedTitles = line => {
  const ky = useOkapiKy();

  const { isLoading, data, refetch } = useQuery(
    ['ui-orders', 'linked-titles', line.id],
    () => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: `poLineId=${line.id} and instanceId="" sortby title`,
      };

      return ky.get('orders/titles', { searchParams }).json();
    },
  );

  return {
    isLoading,
    linkedTitles: data?.titles,
    refetchLinkedTitles: refetch,
  };
};

export const useLinkedInstances = line => {
  const { fetchInstanceRelationTypes } = useInstanceRelationTypes();
  const { isLoading: isLinkedTitlesLoading, linkedTitles = [], refetchLinkedTitles } = useLinkedTitles(line);
  const ky = useOkapiKy();

  const linkedInstanceIds = uniq(linkedTitles.map(({ instanceId }) => instanceId).filter(Boolean));

  if (
    line.instanceId
    && !line.isPackage
    && !linkedTitles.some(({ poLineId }) => poLineId === line.id)
  ) {
    linkedInstanceIds.push(line.instanceId);
  }

  const { isLoading, data } = useQuery(
    ['ui-orders', 'linked-instances', line.id, linkedInstanceIds, linkedTitles],
    async () => {
      const { data: relationTypesData } = await fetchInstanceRelationTypes();

      const hydrateLinkedInstancesMap = await batchRequest(
        async ({ params: searchParams }) => {
          const { instances = [] } = await ky.get('inventory/instances', { searchParams }).json();

          return instances.map((instance) => ({
            ...instance,
            ...hydrateLinkedInstance(instance, relationTypesData?.instanceRelationshipTypes),
          }));
        },
        linkedInstanceIds,
      ).then(keyBy('id'));

      return linkedTitles.map((title) => ({
        ...hydrateLinkedInstancesMap[title.instanceId],
        receivingTitle: title,
      }));
    },
    { enabled: Boolean(linkedInstanceIds.length) },
  );

  return {
    isLoading: isLoading || isLinkedTitlesLoading,
    linkedInstances: data,
    refetch: refetchLinkedTitles,
  };
};
