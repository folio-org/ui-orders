/**
 * Constants for Email Templates
 *
 * Token structure follows Mustache syntax:
 * - Simple tokens: {{vendor.name}}
 * - Loops: {{#orderLines}}...{{/orderLines}}
 */

export const EMAIL_TEMPLATE_CATEGORY = 'OrderEmail';

export const TOKEN_SECTIONS = {
  VENDOR: 'vendor',
  ORDER: 'order',
  ORDER_LINES: 'orderLines',
  LIBRARY: 'library',
};

// TODO: Clarify final token list with backend (mod-template-engine)
export const ORDER_EMAIL_TOKENS = {
  [TOKEN_SECTIONS.VENDOR]: [
    {
      token: 'vendor.name',
      previewValue: 'ACME Books Inc.',
    },
    {
      token: 'vendor.code',
      previewValue: 'ACME-001',
    },
    {
      token: 'vendor.contactEmail',
      previewValue: 'orders@acmebooks.com',
    },
  ],
  [TOKEN_SECTIONS.ORDER]: [
    {
      token: 'order.poNumber',
      previewValue: 'PO-2024-001234',
    },
    {
      token: 'order.orderDate',
      previewValue: '2024-02-03',
    },
    {
      token: 'order.workflowStatus',
      previewValue: 'Open',
    },
    {
      token: 'order.totalEstimatedPrice',
      previewValue: '1,234.56 EUR',
    },
  ],
  [TOKEN_SECTIONS.ORDER_LINES]: [
    {
      token: '#orderLines',
      previewValue: '',
    },
    {
      token: 'orderLine.title',
      previewValue: 'Introduction to Library Science',
    },
    {
      token: 'orderLine.poLineNumber',
      previewValue: 'PO-2024-001234-1',
    },
    {
      token: 'orderLine.quantity',
      previewValue: '2',
    },
    {
      token: 'orderLine.estimatedPrice',
      previewValue: '45.00 EUR',
    },
    {
      token: '/orderLines',
      previewValue: '',
    },
  ],
  [TOKEN_SECTIONS.LIBRARY]: [
    {
      token: 'library.name',
      previewValue: 'Main Library',
    },
    {
      token: 'library.address',
      previewValue: '123 Library Street, Booktown',
    },
  ],
};
