import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import { FIELD_ARRAY_ITEM_IDENTIFIER_KEY } from '../../constants';
import { withUniqueFieldArrayItemKeys } from './withUniqueFieldArrayItemKeys';

const TestComponent = withUniqueFieldArrayItemKeys(({
  onSubmit,
  initialValues,
  ...props
}) => (
  <Form
    onSubmit={onSubmit}
    initialValues={initialValues}
    render={({ handleSubmit, values }) => {
      return (
        <form onSubmit={handleSubmit}>
          <ol>
            {values.items.map((item) => (
              <ul key={item[FIELD_ARRAY_ITEM_IDENTIFIER_KEY]}>
                {Object.values(item).map((val) => <li key={val}>{val}</li>)}
              </ul>
            ))}
          </ol>

          <button type="submit">Submit</button>
        </form>
      );
    }}
    {...props}
  />
));

const renderTestComponent = (props = {}) => render(
  <TestComponent {...props} />,
);

describe('withUniqueFieldArrayItemKeys', () => {
  const onSubmit = jest.fn();
  const initialValues = {
    items: [
      { foo: 'bar' },
      { foo: 'baz' },
      { foo: 'oof' },
    ],
  };

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it('should hydrate initial values field array items with unique identifiers', () => {
    renderTestComponent({
      fieldArraysToHydrate: ['items'],
      initialValues,
      onSubmit,
    });

    expect(screen.getAllByText(new RegExp(`${FIELD_ARRAY_ITEM_IDENTIFIER_KEY}\\d`))).toHaveLength(initialValues.items.length);
  });

  it('should dehydrate field array items from unique identifiers for the form submission', () => {
    renderTestComponent({
      fieldArraysToHydrate: ['items'],
      initialValues,
      onSubmit,
    });

    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith(initialValues);
  });
});
