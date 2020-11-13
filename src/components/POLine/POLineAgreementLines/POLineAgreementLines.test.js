import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';

import POLineAgreementLines from './POLineAgreementLines';

const agrLines = [
  {
    'id': '44e744b4-a8fe-4311-96ad-5969114bb1ea',
    'type': 'external',
    'description': null,
    'authority': 'EKB-PACKAGE',
    'reference': '57-2755038',
    'explanation': null,
    'startDate': null,
    'endDate': null,
    'activeFrom': null,
    'activeTo': null,
    'contentUpdated': null,
    'haveAccess': true,
    'suppressFromDiscovery': false,
    'note': null,
    'tags': [],
    'owner': {
      'id': '8776871b-3472-426e-80eb-0225617192ed',
      'name': '2021 - 2023 Sage Collection',
    },
    'poLines': [{ 'id': 'cb4d4425-8faa-4f78-a624-076afe941f40', 'poLineId': '004b127b-35fc-476a-b6fd-b67c7d167e4d', 'owner': { 'id': '44e744b4-a8fe-4311-96ad-5969114bb1ea' } }],
    'customCoverage': false,
    'reference_object': { 'label': 'SAGE Communication and Media Studies Subject Collection', 'type': 'Package', 'provider': 'SAGE', 'titleCount': 60, 'selectedCount': 0, 'contentType': 'E-Journal', 'providerName': 'SAGE' },
  },
];

const renderPOLineAgreementLines = ({ agreementLines = [], label = '', onNeedMoreData = () => { }, totalCount = 0 }) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <POLineAgreementLines
        agreementLines={agreementLines}
        label={label}
        onNeedMoreData={onNeedMoreData}
        totalCount={totalCount}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('POLineAgreementLines', () => {
  it('with empty lines it displays empty table', () => {
    renderPOLineAgreementLines({});
    expect(screen.getByText('stripes-components.tableEmpty')).toBeDefined();
  });

  it('with agreement lines provided it displays table with records', () => {
    renderPOLineAgreementLines({ agreementLines: agrLines, totalCount: agrLines.length });
    expect(screen.getByText(agrLines[0].owner.name)).toBeInTheDocument();
  });
});
