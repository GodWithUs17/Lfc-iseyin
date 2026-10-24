const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeSermonRecord } = require('./sermons.service');

test('sermon records expose preacher consistently from database speaker values', () => {
  const sermon = normalizeSermonRecord({
    id: 'sermon-123',
    title: 'The Power of Faith',
    speaker: 'Pastor Adebayo',
    audioUrl: 'https://example.com/audio.mp3',
    date: '2026-10-09T00:00:00.000Z',
    category: 'Sunday Service',
  });

  assert.equal(sermon.preacher, 'Pastor Adebayo');
  assert.equal(sermon.speaker, 'Pastor Adebayo');
  assert.equal(sermon.youtubeUrl, 'https://example.com/audio.mp3');
  assert.equal(sermon.date, '2026-10-09');
});
