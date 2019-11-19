import {
  collection,
  interactor,
  isPresent,
} from '@bigtest/interactor';

import { TIMEOUT } from '../../const';

export default interactor(class OrderTemplatesList {
  static defaultScope = '#order-settings-order-templates-list';

  isLoaded = isPresent('#paneHeaderorder-settings-order-templates-list-pane-title');
  list = collection('[class*=NavListItem---]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
