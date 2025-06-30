import {
  act,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';

import { useReceivingWorkflowChange } from './useReceivingWorkflowChange';

describe('useReceivingWorkflowChange', () => {
  let control;

  beforeAll(() => {
    const { result } = renderHook(() => useReceivingWorkflowChange());

    control = result.current;
  });

  it('should resolve promise on confirm', async () => {
    let resolved = false;

    await act(async () => {
      control.initReceivingWorkflowChange().then(() => {
        resolved = true;
      });
    });

    await act(async () => {
      control.confirmReceivingWorkflowChange();
    });

    // Wait for microtask queue to flush
    await Promise.resolve();

    expect(resolved).toBe(true);
  });

  it('should reject promise on cancel', async () => {
    let rejected = false;

    await act(async () => {
      control.initReceivingWorkflowChange().catch(() => {
        rejected = true;
      });
    });

    await act(async () => {
      control.cancelReceivingWorkflowChange();
    });

    // Wait for microtask queue to flush
    await Promise.resolve();

    expect(rejected).toBe(true);
  });
});
