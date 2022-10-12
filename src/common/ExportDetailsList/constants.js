import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { EXPORT_MANAGER_EDI_JOBS_ROUTE } from '../constants';

export const VISIBLE_COLUMNS = [
  'jobName',
  'exportDate',
  'exportFileName',
  'exportMethod',
];

export const COLUMN_MAPPING = {
  jobName: <FormattedMessage id="ui-orders.export.jobId" />,
  exportDate: <FormattedMessage id="ui-orders.export.exportDate" />,
  exportFileName: <FormattedMessage id="ui-orders.export.fileName" />,
  exportMethod: <FormattedMessage id="ui-orders.export.method" />,
};

export const RESULTS_FORMATTER = {
  jobName: item => <Link to={`${EXPORT_MANAGER_EDI_JOBS_ROUTE}/${item.exportJobId}`}>{item.jobName}</Link>,
  exportDate: item => <FolioFormattedDate value={item.exportDate} />,
  exportFileName: item => item.exportFileName,
  exportMethod: item => item.exportMethod,
};
