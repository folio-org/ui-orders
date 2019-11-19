import {
  collection,
  interactor,
} from '@bigtest/interactor';

import { TIMEOUT } from '../const';

export default interactor(class SettingsInteractor {
  static defaultScope = '[data-test-nav-list]';

  orderSettings = collection('[class*=NavListItem---]');

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.orderSettings.isPresent);
  }
});
