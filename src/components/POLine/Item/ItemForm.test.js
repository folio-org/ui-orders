import React from 'react';
import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Pluggable } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/final-form';

import { instance, order, orderLine } from '../../../../test/jest/fixtures';
import { PRODUCT_ID_TYPE } from '../../../common/constants';
import ItemForm from './ItemForm';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(({ children }) => <>{children}</>),
  stripesConnect: jest.fn(Component => (props) => (
    <Component
      {...props}
      mutator={{
        validateISBN: { GET: jest.fn(() => Promise.resolve()) },
      }}
      resources={{
        linkedPoLine: { records: [{ id: 'baec48dd-1594-2712-be8f-de336bc83fcc', titleOrPackage: 'Interesting Times' }] },
      }}
    />
  )),
}));

const defaultProps = {
  order,
  required: false,
};

const contributorNameTypes = [
  { label: 'Test contributor', value: 'testContributorId' },
  ...instance.contributors.map(
    ({ contributorNameTypeId, name }) => ({ label: name, value: contributorNameTypeId }),
  ),
];

const identifierTypes = [
  { label: 'ISSN', value: '3461054f-be78-422d-bd51-4ed9f33c8745' },
  { label: PRODUCT_ID_TYPE.isbn, value: '8261054f-be78-422d-bd51-4ed9f33c3422' },
];

const normalizeProps = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return (
        <WrappedComponent
          formValues={this.props.values}
          {...this.props.form}
          {...this.props}
        />
      );
    }
  };
};

const WrappedItemForm = stripesForm({ subscription: { values: true } })(normalizeProps(ItemForm));

const renderItemForm = (props = {}, initialValues = {}) => render(
  <WrappedItemForm
    onSubmit={jest.fn()}
    initialValues={initialValues}
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ItemForm', () => {
  const selectInstance = async (_instance) => act(async () => Pluggable.mock.calls[0][0].selectInstance(_instance));
  const selectPackage = async (line) => act(async () => Pluggable.mock.calls[1][0].addLines([line]));

  beforeEach(() => {
    Pluggable.mockClear();
  });

  it('should render \'item form\' fields', () => {
    renderItemForm();

    expect(screen.getByText('ui-orders.poLine.package')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.title')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.receivingNote')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.subscriptionFrom')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.subscriptionTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.subscriptionInterval')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.publicationDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.publisher')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.edition')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.linkPackage')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.contributors')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.productIds')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.internalNote')).toBeInTheDocument();
  });

  it('should handle \'package field\' change', async () => {
    renderItemForm();

    await act(async () => user.click(screen.getByLabelText('ui-orders.poLine.package')));

    expect(screen.getByRole('checkbox', { name: 'ui-orders.poLine.package' })).toBeChecked();
  });

  it('should handle \'TitleField\' change', () => {
    renderItemForm();

    const field = screen.getByLabelText('ui-orders.itemDetails.title');

    user.type(field, 'new title');

    expect(field.value).toBe('new title');
  });

  it('should handle \'publisher field\' change', () => {
    renderItemForm();

    const field = screen.getByLabelText('ui-orders.itemDetails.publisher');

    user.type(field, 'new publisher');

    expect(field.value).toBe('new publisher');
  });

  it('should handle \'publicationDate field\' change', () => {
    renderItemForm();

    const field = screen.getByLabelText('ui-orders.itemDetails.publicationDate');

    user.type(field, '01/01/2021');

    expect(field.value).toBe('01/01/2021');
  });

  it('should handle \'edition field\' change', () => {
    renderItemForm();

    const field = screen.getByLabelText('ui-orders.itemDetails.edition');

    user.type(field, 'some edition');

    expect(field.value).toBe('some edition');
  });

  it('should handle linked package addition', async () => {
    renderItemForm();

    await selectPackage(orderLine);

    expect(screen.getByRole('textbox', { name: 'ui-orders.itemDetails.linkPackage' }).value).toEqual(orderLine.titleOrPackage);
  });

  it('should handle \'ContributorForm\' change', async () => {
    renderItemForm({ contributorNameTypes });

    await act(async () => user.click(screen.getByRole('button', { name: 'ui-orders.itemDetails.addContributorBtn' })));
    await act(async () => user.selectOptions(screen.getByRole('combobox', { name: 'ui-orders.itemDetails.contributorType' }), [contributorNameTypes[1].value]));

    expect(screen.getByRole('option', { name: contributorNameTypes[1].label }).selected).toBeTruthy();
  });

  it('should handle instance addition', async () => {
    renderItemForm({
      contributorNameTypes,
      identifierTypes,
    });

    await selectInstance(instance);

    expect(screen.getByTestId('titleOrPackage-field')).toHaveValue(instance.title);
    expect(screen.getByText('ui-orders.itemDetails.connectedTitle')).toBeInTheDocument();
  });

  describe('Connected instance', () => {
    beforeEach(async () => {
      renderItemForm({
        contributorNameTypes,
        identifierTypes,
      });

      await selectInstance(instance);
    });

    describe('Break instance connection modal', () => {
      const clickConfirmBreakInstanceConnection = async () => {
        await act(async () => user.click(screen.getByRole('button', { name: 'ui-orders.button.confirm' })));
      };
      const clickCancelBreakInstanceConnection = async () => {
        await act(async () => user.click(screen.getByRole('button', { name: 'stripes-components.cancel' })));
      };
      const expectConnectedTitle = () => {
        expect(screen.getByText('ui-orders.itemDetails.connectedTitle')).toBeInTheDocument();
      };
      const expectNotConnectedTitle = () => {
        expect(screen.getByText('ui-orders.itemDetails.notConnectedTitle')).toBeInTheDocument();
      };
      const getDeleteItemBtns = () => screen.getAllByRole('button', { name: 'stripes-components.deleteThisItem' });

      describe('\'Package\' field', () => {
        let isPackageCheckbox;

        beforeEach(async () => {
          isPackageCheckbox = screen.getByRole('checkbox', { name: 'ui-orders.poLine.package' });
          await act(async () => user.click(isPackageCheckbox));
        });

        it('should intercept instance connection break on field change', async () => {
          expect(isPackageCheckbox).toBeChecked();
          expectConnectedTitle();
        });

        it('should break instance connection on confirm', async () => {
          await clickConfirmBreakInstanceConnection();

          expect(isPackageCheckbox).toBeChecked();
          expectNotConnectedTitle();
        });

        it('should NOT break instance connection on cancel', async () => {
          await clickCancelBreakInstanceConnection();

          expect(isPackageCheckbox).not.toBeChecked();
          expectConnectedTitle();
        });
      });

      describe('\'Title\' field', () => {
        let titleField;

        beforeEach(async () => {
          titleField = screen.getByTestId('titleOrPackage-field');
          await act(async () => user.type(titleField, '!'));
        });

        it('should intercept instance connection break on field change', async () => {
          expect(titleField).toHaveValue(`${instance.title}!`);
          expectConnectedTitle();
        });

        it('should break instance connection on confirm', async () => {
          await clickConfirmBreakInstanceConnection();

          expect(titleField).toHaveValue(`${instance.title}!`);
          expectNotConnectedTitle();
        });

        it('should NOT break instance connection on cancel', async () => {
          await clickCancelBreakInstanceConnection();

          expect(titleField).toHaveValue(instance.title);
          expectConnectedTitle();
        });
      });

      describe('\'Contributors\' fields', () => {
        describe('Edit', () => {
          let contributorTypeField;

          beforeEach(async () => {
            contributorTypeField = screen.getAllByRole('combobox', { name: 'ui-orders.itemDetails.contributorType' })[0];
            await act(async () => user.selectOptions(contributorTypeField, [contributorNameTypes[0].value]));
          });

          it('should break instance connection on confirm', async () => {
            await clickConfirmBreakInstanceConnection();

            expect(screen.getByRole('option', { name: contributorNameTypes[0].label }).selected).toBeTruthy();
            expectNotConnectedTitle();
          });

          it('should NOT break instance connection on cancel', async () => {
            await clickCancelBreakInstanceConnection();

            expect(screen.getByRole('option', { name: contributorNameTypes[0].label }).selected).toBeFalsy();
            expectConnectedTitle();
          });
        });

        describe('Delete connected', () => {
          beforeEach(async () => {
            await act(async () => user.click(screen.getAllByRole('button', { name: 'stripes-components.deleteThisItem' })[0]));
          });

          it('should intercept instance connection break on field delete', async () => {
            expect(screen.getByText('ui-orders.breakInstanceConnection.modal.heading')).toBeInTheDocument();
            expect(screen.getByText(contributorNameTypes[0].label)).toBeInTheDocument();
            expectConnectedTitle();
          });

          it('should break instance connection on confirm', async () => {
            await clickConfirmBreakInstanceConnection();

            expect(screen.queryByText(contributorNameTypes[0].label)).not.toBeInTheDocument();
            expectNotConnectedTitle();
          });

          it('should NOT break instance connection on cancel', async () => {
            await clickCancelBreakInstanceConnection();

            expect(screen.getByText(contributorNameTypes[0].label)).toBeInTheDocument();
            expectConnectedTitle();
          });
        });

        describe('Delete added', () => {
          it('should NOT intercept instance connection break on field delete', async () => {
            await act(async () => user.click(screen.getByRole('button', { name: 'ui-orders.itemDetails.addContributorBtn' })));

            const deleteIBtns = getDeleteItemBtns();
            const deleteContributorBtns = deleteIBtns.slice(0, orderLine.contributors.length + 1);

            await act(async () => user.click(deleteContributorBtns[deleteContributorBtns.length - 1]));

            expect(screen.queryByText('ui-orders.breakInstanceConnection.modal.heading')).not.toBeInTheDocument();
            expect(getDeleteItemBtns().length).toEqual(deleteIBtns.length - 1);
            expectConnectedTitle();
          });
        });
      });

      describe('\'Product identifiers\' fields', () => {
        describe('Edit', () => {
          let productIdField;

          beforeEach(async () => {
            productIdField = screen.getAllByRole('combobox', { name: 'ui-orders.itemDetails.productIdType' })[0];
            await act(async () => user.selectOptions(productIdField, [identifierTypes[0].value]));
          });

          it('should break instance connection on confirm', async () => {
            await clickConfirmBreakInstanceConnection();

            expect(screen.getByRole('option', { name: identifierTypes[0].label }).selected).toBeTruthy();
            expectNotConnectedTitle();
          });

          it('should NOT break instance connection on cancel', async () => {
            await clickCancelBreakInstanceConnection();

            expect(screen.getByRole('option', { name: identifierTypes[0].label }).selected).toBeFalsy();
            expectConnectedTitle();
          });
        });

        describe('Delete', () => {
          it('should NOT intercept instance connection break on field delete', async () => {
            await act(async () => user.click(screen.getByRole('button', { name: 'ui-orders.itemDetails.addProductIdBtn' })));

            const deleteBtns = getDeleteItemBtns();
            const deleteProductIdBtns = deleteBtns.slice(orderLine.contributors.length);

            await act(async () => user.click(deleteProductIdBtns[deleteProductIdBtns.length - 1]));

            expect(screen.queryByText('ui-orders.breakInstanceConnection.modal.heading')).not.toBeInTheDocument();
            expect(getDeleteItemBtns().length).toEqual(deleteBtns.length - 1);
            expectConnectedTitle();
          });
        });
      });
    });
  });
});
