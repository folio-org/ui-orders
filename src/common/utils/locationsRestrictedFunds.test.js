import {
  filterFundsRestrictedByLocations,
  filterHoldingsByRestrictedFunds,
  filterLocationsByRestrictedFunds,
} from './locationsRestrictedFunds';

describe('Filtering funds and locations', () => {
  describe('filterFundsRestrictedByLocations', () => {
    it('should return all available funds if there are no assigned locations', () => {
      const locationIds = [];
      const funds = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];

      expect(filterFundsRestrictedByLocations(locationIds, funds)).toEqual(funds);
    });

    it('should return unrestricted funds and funds restricted by specified locations', () => {
      const locationIds = ['2', '3'];
      const funds = [
        {
          id: '1',
          restrictByLocations: true,
          locationIds: ['2', '4'],
        },
        {
          id: '2',
          restrictByLocations: true,
          locationIds: ['3', '4'],
        },
        {
          id: '3',
          restrictByLocations: true,
          locationIds: ['5'],
        },
        {
          id: '4',
          restrictByLocations: false,
        },
      ];

      expect(filterFundsRestrictedByLocations(locationIds, funds)).toEqual(funds.toSpliced(2, 1));
    });
  });

  describe('filterHoldingsByRestrictedFunds', () => {
    it('should return all available holdings if there are no assigned funds', () => {
      const funds = [];
      const holdings = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];

      expect(filterHoldingsByRestrictedFunds(funds, holdings)).toEqual(holdings);
    });

    it('should return all available holdings if there is at least one unrestricted fund assigned', () => {
      const funds = [
        {
          id: '1',
          restrictByLocations: false,
        },
        {
          id: '2',
          restrictByLocations: true,
          locationIds: ['1', '2'],
        },
      ];
      const holdings = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];

      expect(filterHoldingsByRestrictedFunds(funds, holdings)).toEqual(holdings);
    });

    it('should return a list of holdings for which their permanent locations restrict assigned funds', () => {
      const funds = [
        {
          id: '1',
          restrictByLocations: true,
          locationIds: ['4'],
        },
        {
          id: '2',
          restrictByLocations: true,
          locationIds: ['1', '2'],
        },
      ];
      const holdings = [
        {
          id: '1',
          permanentLocationId: '3',
        },
        {
          id: '2',
          permanentLocationId: '1',
        },
        {
          id: '3',
          permanentLocationId: '8',
        },
      ];

      expect(filterHoldingsByRestrictedFunds(funds, holdings)).toEqual([holdings[1]]);
    });

    it('should persist holdings provided by IDs', () => {
      const funds = [
        {
          id: '1',
          restrictByLocations: true,
          locationIds: ['4'],
        },
      ];
      const holdings = [
        {
          id: '1',
          permanentLocationId: '5',
        },
        {
          id: '2',
          permanentLocationId: '6',
        },
      ];

      expect(filterHoldingsByRestrictedFunds(funds, holdings, ['2'])).toEqual([holdings[1]]);
    });
  });

  describe('filterLocationsByRestrictedFunds', () => {
    it('should return all available locations if there are no assigned funds', () => {
      const funds = [];
      const locations = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];

      expect(filterLocationsByRestrictedFunds(funds, locations)).toEqual(locations);
    });

    it('should return all available locations if there is at least one unrestricted fund assigned', () => {
      const funds = [
        {
          id: '1',
          restrictByLocations: false,
        },
        {
          id: '2',
          restrictByLocations: true,
          locationIds: ['1', '2'],
        },
      ];
      const locations = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];

      expect(filterLocationsByRestrictedFunds(funds, locations)).toEqual(locations);
    });

    it('should return a list of locations that restrict assigned funds', () => {
      const funds = [
        {
          id: '1',
          restrictByLocations: true,
          locationIds: ['4'],
        },
        {
          id: '2',
          restrictByLocations: true,
          locationIds: ['1', '2'],
        },
      ];
      const locations = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
      ];

      expect(filterLocationsByRestrictedFunds(funds, locations)).toEqual(locations.toSpliced(2, 1));
    });

    it('should persist locations provided by IDs', () => {
      const funds = [
        {
          id: '1',
          restrictByLocations: true,
          locationIds: ['1', '3'],
        },
      ];
      const locations = [
        { id: '1' },
        { id: '2' },
        { id: '3' },
      ];

      expect(filterLocationsByRestrictedFunds(funds, locations, ['2'])).toEqual(locations);
    });
  });
});
