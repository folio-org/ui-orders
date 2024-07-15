import get from 'lodash/get';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';
import {
  ITEMS_API,
  usePublishCoordinator,
} from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useConsortiumPOLineRelatedItems = (poLine, options = {}) => {
  const {
    enabled = true,
    ...queryOptions
  } = options;

  const { initPublicationRequest } = usePublishCoordinator();
  const [namespace] = useNamespace('consortium-items-by-holding-ids');

  const tenants = useMemo(() => {
    return [...get(poLine, 'locations', []).reduce((acc, { holdingId, tenantId }) => {
      return holdingId && tenantId ? acc.add(tenantId) : acc;
    }, new Set())];
  }, [poLine]);

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [namespace, tenants, poLine?.id],
    queryFn: async () => {
      if (!tenants?.length) return [];

      const publication = {
        url: `${ITEMS_API}?query=purchaseOrderLineIdentifier==${poLine.id}`,
        method: 'GET',
        tenants,
      };

      const {
        publicationErrors: errors,
        publicationResults,
      } = await initPublicationRequest(publication);

      const items = publicationResults.flatMap(({ tenantId, response }) => (
        response?.items?.map((item) => {
          const additive = {
            tenantId,
          };

          return { ...item, ...additive };
        })
      )).filter(Boolean);

      return {
        items,
        errors,
      };
    },
    enabled: enabled && Boolean(poLine?.id),
    ...queryOptions,
  });

  return {
    items: data?.items || DEFAULT_DATA,
    errors: data?.errors,
    isFetching,
    isLoading,
  };
};
