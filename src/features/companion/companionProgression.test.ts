import { describe, expect, it } from 'vitest';
import { deriveCompanionProgress } from './companionProgression';

describe('deriveCompanionProgress', () => {
  it('grants XP once per training day', () => {
    const result = deriveCompanionProgress([
      { finishedAt: '2026-08-13T09:00:00.000Z' },
      { finishedAt: '2026-08-13T18:00:00.000Z' },
      { finishedAt: '2026-08-12T18:00:00.000Z' },
    ], new Date('2026-08-13T20:00:00.000Z'));
    expect(result.totalActiveDays).toBe(2);
    expect(result.totalXp).toBe(200);
  });

  it('levels every five active days', () => {
    const sessions = Array.from({ length: 6 }, (_, index) => ({
      finishedAt: `2026-08-${String(index + 1).padStart(2, '0')}T12:00:00.000Z`,
    }));
    const result = deriveCompanionProgress(sessions, new Date('2026-08-06T20:00:00.000Z'));
    expect(result.level).toBe(2);
    expect(result.xpIntoLevel).toBe(100);
  });
});
