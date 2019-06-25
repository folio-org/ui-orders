import {
  clickable,
  interactor,
  Interactor,
  isPresent,
  isVisible,
} from '@bigtest/interactor';
import Button from '../../button';
import { ORDER_TEMPLATES_ACCORDION } from '../../../../../src/settings/OrderTemplates/constants';

@interactor class TemplateInfoAccordion {
  static defaultScope = `#${ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO}`;
  clickHeader = clickable('[class*=defaultCollapseButton---]');
  isExpanded = isVisible('[class*=content---]');
}
export default interactor(class OrderTemplateView {
  static defaultScope = '#order-settings-order-template-view';

  isLoaded = isPresent('#paneHeaderorder-settings-order-template-view-pane-title');
  actions = new Interactor('[data-test-view-order-template-actions]')
  paneHeaderCenterButton = new Button('[class*=paneHeaderCenterButton---]');
  editButton = new Button('[data-test-view-order-template-action-edit]');
  deleteButton = new Button('[data-test-view-order-template-action-delete]');
  templateInfoAccordion = new TemplateInfoAccordion();

  whenLoaded() {
    return this.timeout(5000).when(() => this.isLoaded);
  }
});
