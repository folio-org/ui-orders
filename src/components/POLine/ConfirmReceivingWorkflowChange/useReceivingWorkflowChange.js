import {
  useCallback,
  useRef,
} from 'react';

import { useModalToggle } from '@folio/stripes-acq-components';

export const useReceivingWorkflowChange = () => {
  const promiseRef = useRef({ resolve: Promise.resolve, reject: Promise.reject });
  const [isModalOpen, toggleModal] = useModalToggle();

  const initReceivingWorkflowChange = useCallback(() => (
    new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
      toggleModal();
    })
      .then(() => {})
      .finally(() => toggleModal())
  ), [toggleModal]);

  const confirmReceivingWorkflowChange = useCallback(() => {
    promiseRef.current.resolve();
  }, []);

  const cancelReceivingWorkflowChange = useCallback(() => {
    promiseRef.current.reject();
  }, []);

  return {
    cancelReceivingWorkflowChange,
    confirmReceivingWorkflowChange,
    initReceivingWorkflowChange,
    isModalOpen,
  };
};
