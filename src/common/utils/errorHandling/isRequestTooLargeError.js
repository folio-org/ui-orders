export const isRequestTooLargeError = (response) => {
  return [
    414, /* URI_TOO_LONG */
    431, /* REQUEST_HEADER_FIELDS_TOO_LARGE */
  ].includes(response?.status);
};
