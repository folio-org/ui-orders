import {
  interactor,
  collection,
} from '@bigtest/interactor';

import {
  ButtonInteractor,
  TextFieldInteractor,
} from '@folio/stripes-acq-components/test/bigtest/interactors';

@interactor class Prefixes {
  list = collection('[class*=editListRow---]', {
    nameInput: new TextFieldInteractor('input[type="text"]'),
    saveButton: new ButtonInteractor('#clickable-save-prefixes-0'),
    cancelButton: new ButtonInteractor('#clickable-cancel-prefixes-0'),
    editButton: new ButtonInteractor('#clickable-edit-prefixes-0'),
    deleteButton: new ButtonInteractor('#clickable-delete-prefixes-0'),
  });
}

export default interactor(class PrefixesInteractor {
  static defaultScope = '#prefixes';

  prefixes = new Prefixes('#editList-prefixes');
  addPrefixBtn = new ButtonInteractor('#clickable-add-prefixes');
});
