import React from 'react';
import user from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';

import ItemForm from './ItemForm';
import PackagePoLineField from './PackagePoLineField';
import ContributorForm from './ContributorForm';
import InstancePlugin from './InstancePlugin';

import { order, orderLine } from '../../../../test/jest/fixtures';

jest.mock('./PackagePoLineField', () => jest.fn().mockReturnValue('PackagePoLineField'));
jest.mock('./ProductIdDetailsForm', () => jest.fn().mockReturnValue('ProductIdDetailsForm'));
jest.mock('./ContributorForm', () => jest.fn().mockReturnValue('ContributorForm'));
jest.mock('./InstancePlugin', () => jest.fn().mockReturnValue('InstancePlugin'));

const defaultProps = {
  formValues: {
    packagePoLineId: orderLine.id,
  },
  identifierTypes: [{
    label: 'ISBN',
    value: 'ISBN',
  }],
  order,
  required: false,
  initialValues: {},
  change: jest.fn(),
  batch: jest.fn((fn) => fn()),
};

const renderItemForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <ItemForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('ItemForm', () => {
  beforeEach(() => {
    defaultProps.change.mockClear();
    defaultProps.batch.mockClear();
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
    expect(screen.getByText(/PackagePoLineField/i)).toBeInTheDocument();
    expect(screen.getByText(/ContributorForm/i)).toBeInTheDocument();
    expect(screen.getByText(/ProductIdDetailsForm/i)).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.internalNote')).toBeInTheDocument();
  });

  it('should handle \'package field\' change', () => {
    renderItemForm();

    user.click(screen.getByLabelText('ui-orders.poLine.package'));

    expect(defaultProps.batch).toHaveBeenCalled();
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

  it('should call onAddLinkPackage when \'PackagePoLineField\' was selected', () => {
    renderItemForm();

    PackagePoLineField.mock.calls[0][0].onSelectLine([orderLine]);

    expect(defaultProps.change).toHaveBeenCalled();
  });

  it('should call onChangeField when \'ContributorForm\'', async () => {
    renderItemForm();

    await waitFor(() => ContributorForm.mock.calls[0][0].onChangeField('value', 'fieldName'));

    expect(defaultProps.change).toHaveBeenCalled();
  });

  it('should call onAddLinkPackage when \'PackagePoLineField\' was selected', () => {
    renderItemForm();

    PackagePoLineField.mock.calls[0][0].onSelectLine([orderLine]);

    expect(defaultProps.change).toHaveBeenCalled();
  });

  it('should handle instance addition', () => {
    const instance = {
      contributors: [{
        name: 'name',
        contributorNameTypeId: 'contributorNameTypeId',
      }],
      editions: 'editions',
      publication: [{
        publisher: 'publisher',
      }],
      title: 'title',
      identifiers: [{
        identifierTypeId: 'ISBN',
        value: 'some value',
      }],
      id: 'id',
    };

    renderItemForm();

    InstancePlugin.mock.calls[0][0].addInstance(instance);

    expect(defaultProps.change).toHaveBeenCalled();
  });
});
