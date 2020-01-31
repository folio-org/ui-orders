import {
  clickable,
  interactor,
  Interactor,
  isPresent,
} from '@bigtest/interactor';
import Button from '../../button';
import { ORDER_TEMPLATES_ACCORDION } from '../../../../../src/settings/OrderTemplates/constants';
import { TIMEOUT } from '../../const';

@interactor class TemplateInfoAccordion {
  static defaultScope = `#${ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO}`;
  clickHeader = clickable('[class*=defaultCollapseButton---]');
  isExpanded = isPresent('[class*=expanded---]');
}
export default interactor(class OrderTemplateView {
  static defaultScope = '#order-settings-order-template-view';

  isLoaded = isPresent('#paneHeaderorder-settings-order-template-view-pane-title');
  actions = new Interactor('[data-test-view-order-template-actions]')
  paneHeaderCenterButton = new Button('[data-test-pane-header-actions-button]');
  editButton = new Button('[data-test-view-order-template-action-edit]');
  deleteButton = new Button('[data-test-view-order-template-action-delete]');
  templateInfoAccordion = new TemplateInfoAccordion();

  whenLoaded() {
    return this.timeout(TIMEOUT).when(() => this.isLoaded);
  }
});
