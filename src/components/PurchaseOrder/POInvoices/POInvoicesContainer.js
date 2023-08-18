import PropTypes from 'prop-types';

import { Accordion, Loading } from '@folio/stripes/components';

import { ACCORDION_ID } from '../../POLine/const';
import POInvoices from './POInvoices';
import { useRelatedInvoices } from './useRelatedInvoices';

const POInvoicesContainer = ({ label, orderInvoicesIds }) => {
  const { isLoading, orderInvoices } = useRelatedInvoices(orderInvoicesIds);

  return (
    <Accordion
      label={label}
      id={ACCORDION_ID.relatedInvoices}
    >
      {isLoading ? <Loading /> : <POInvoices orderInvoices={orderInvoices} />}
    </Accordion>
  );
};

POInvoicesContainer.propTypes = {
  orderInvoicesIds: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.object.isRequired,
};

POInvoicesContainer.defaultProps = {
  orderInvoicesIds: [],
};

export default POInvoicesContainer;
