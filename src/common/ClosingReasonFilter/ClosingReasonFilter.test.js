import { render } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import ClosingReasonFilter from './ClosingReasonFilter';

const options = [
  {
    value: 'opt-1',
    label: 'Option 1',
  },
  {
    value: 'opt-2',
    label: 'Option 2',
  },
  {
    value: 'opt-3',
    label: 'Option 3',
  },
];

const defaultProps = {
  id: 'test-closing-reason-filter-id',
  name: 'test-closing-reason-filter-name',
  labelId: 'test-closing-reason-filter-labelid',
  onChange: jest.fn(() => {}),
};

const renderClosingReasonFilter = (props = defaultProps) => (render(
  <ClosingReasonFilter
    {...props}
  />,
));

describe('ClosingReasonFilter', () => {
  it('should not return any item when no options are passed', async () => {
    const { baseElement } = renderClosingReasonFilter();

    expect(baseElement.querySelectorAll('li.groupLabel')).toHaveLength(0);
  });

  it('should return list of options', async () => {
    const { baseElement, getByText } = renderClosingReasonFilter({ ...defaultProps, closingReasons: options });

    await user.click(getByText('stripes-components.selection.controlLabel'));

    expect(baseElement.querySelectorAll('li.groupLabel')).toHaveLength(3);
  });
});
