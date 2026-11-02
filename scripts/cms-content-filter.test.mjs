import assert from 'node:assert/strict';
import test from 'node:test';

import { applyMicroCMSFilters, findMicroCMSContent, sliceMicroCMSPage } from '../lib/microcms/content-filter.ts';

const events = [
  { id: 'a', slug: 'bingo', category: ['stage'], title: 'BINGO' },
  { id: 'b', slug: 'truck', category: ['food-truck', 'booth'], title: 'Kitchen' },
  { id: 'c', slug: 'class-4e', category: ['class-exhibit'], title: '4E' },
];

test('slug equals and category contains match the queries the site sends', () => {
  assert.deepEqual(
    applyMicroCMSFilters(events, 'slug[equals]bingo').map((item) => item.id),
    ['a'],
  );
  assert.deepEqual(
    applyMicroCMSFilters(events, 'category[contains]food-truck').map((item) => item.id),
    ['b'],
  );
  assert.deepEqual(
    applyMicroCMSFilters(events, 'category[contains]booth[and]slug[equals]truck').map((item) => item.id),
    ['b'],
  );
});

test('list page reports totalCount across the filtered set', () => {
  const page = sliceMicroCMSPage(events, { limit: 1, offset: 1 });
  assert.equal(page.totalCount, 3);
  assert.equal(page.contents[0]?.id, 'b');
  assert.equal(findMicroCMSContent(events, 'c')?.slug, 'class-4e');
  assert.equal(findMicroCMSContent(events, 'missing'), null);
});
