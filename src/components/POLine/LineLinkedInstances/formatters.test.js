import {
  formatPublishers,
  formatContributors,
  formatRelations,
} from './formatters';

describe('LineLinkedInstances formatters', () => {
  describe('formatPublishers', () => {
    it('returns formatted publishers string', () => {
      const publishers = [
        { publisher: 'publisher1' },
        undefined,
        { publisher: 'publisher2', dateOfPublication: '2015' },
      ];

      expect(formatPublishers(publishers)).toBe('publisher1, publisher2 (2015)');
    });

    it('returns empty string when publishers are not defined', () => {
      expect(formatPublishers()).toBe('');
    });
  });

  describe('formatContributors', () => {
    it('returns formatted contributors string', () => {
      const contributors = [
        { name: 'contributor1' },
        undefined,
        { name: 'contributor2' },
      ];

      expect(formatContributors(contributors)).toBe('contributor1; contributor2');
    });

    it('returns empty string when contributors are not defined', () => {
      expect(formatContributors()).toBe('');
    });
  });

  describe('formatRelations', () => {
    const relationTypes = [{ id: 'instanceRelationshipTypeId', name: 'mono' }];

    it('returns formatted contributors string with parent relation', () => {
      const children = [{ instanceRelationshipTypeId: 'instanceRelationshipTypeId2' }];
      const parents = [{ instanceRelationshipTypeId: 'instanceRelationshipTypeId' }];

      expect(formatRelations(parents, children, relationTypes)).toBe('mono');
    });

    it('returns formatted contributors string with child relation', () => {
      const children = [{ instanceRelationshipTypeId: 'instanceRelationshipTypeId' }];

      expect(formatRelations(undefined, children, relationTypes)).toBe('mono (M)');
    });

    it('returns empty string when relations are not defined', () => {
      expect(formatRelations()).toBe('');
    });
  });
});
