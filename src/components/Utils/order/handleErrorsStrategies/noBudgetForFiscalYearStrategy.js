import { ERROR_CODES } from '../../../../common/constants';

export const noBudgetForFiscalYearStrategy = ({ callout }) => {
  const handle = (errorsContainer) => {
    let fundCodes;
    const error = errorsContainer.getError();
    const fiscalYearCode = error.getParameter('fiscalYearCode');

    try {
      fundCodes = JSON.parse(error.getParameter('fundCodes')).join(', ');
    } catch {
      fundCodes = error.getParameter('fundCodes');
    }

    callout.sendCallout({
      messageId: `ui-orders.errors.${ERROR_CODES[error.code]}`,
      type: 'error',
      values: {
        fiscalYearCode,
        fundCodes,
      },
    });
  };

  return { handle };
};
