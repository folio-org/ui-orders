import { ERROR_CODES } from '../../../../common/constants';

export const noBudgetForFiscalYearStrategy = ({ callout }) => {
  const handle = (errorsContainer) => {
    const error = errorsContainer.getError();
    const fundCodes = error.getParameter('fundCodes');
    const fiscalYearCode = error.getParameter('fiscalYearCode');

    callout.sendCallout({
      messageId: `ui-orders.errors.${ERROR_CODES[error.code]}`,
      type: 'error',
      values: {
        fiscalYearCode,
        fundCodes: JSON.parse(fundCodes)?.join(', '),
      },
    });
  };

  return { handle };
};
