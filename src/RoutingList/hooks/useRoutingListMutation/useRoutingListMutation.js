import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../common/constants';

export const useRoutingListMutation = () => {
  const ky = useOkapiKy();

  const createMutationFn = (values = {}) => {
    return ky.post(ROUTING_LIST_API, {
      json: values,
    });
  };

  const updateMutationFn = (values = {}) => {
    return ky.put(`${ROUTING_LIST_API}/${values.id}`, {
      json: values,
    });
  };

  const deleteMutationFn = (listId) => {
    return ky.delete(`${ROUTING_LIST_API}/${listId}`);
  };

  const { mutateAsync: createListing, isLoading: isCreating } = useMutation({ mutationFn: createMutationFn });
  const { mutateAsync: updateListing, isLoading: isUpdating } = useMutation({ mutationFn: updateMutationFn });
  const { mutateAsync: deleteListing, isLoading: isDeleting } = useMutation({ mutationFn: deleteMutationFn });

  return {
    createListing,
    deleteListing,
    updateListing,
    isCreating,
    isDeleting,
    isUpdating,
  };
};
