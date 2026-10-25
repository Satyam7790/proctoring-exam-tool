import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreObjectiveAnswer } from '../src/shared/scoring.ts';

test('scores an exact single-choice answer and rejects an incorrect answer', () => {
  assert.equal(scoreObjectiveAnswer('Queue', 'Queue', 10), 10);
  assert.equal(scoreObjectiveAnswer('Stack', 'Queue', 10), 0);
});

test('multiple-select requires all and only the expected options, regardless of order', () => {
  assert.equal(scoreObjectiveAnswer(['boolean', 'string'], ['string', 'boolean'], 10), 10);
  assert.equal(scoreObjectiveAnswer(['string'], ['string', 'boolean'], 10), 0);
  assert.equal(scoreObjectiveAnswer(['string', 'boolean', 'array'], ['string', 'boolean'], 10), 0);
});

test('does not award points for blank or zero-weight answers', () => {
  assert.equal(scoreObjectiveAnswer(null, 'x', 5), 0);
  assert.equal(scoreObjectiveAnswer('x', 'x', 0), 0);
});
