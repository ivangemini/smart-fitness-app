import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const storySettings = readFileSync(
  resolve(process.cwd(), 'src/features/social/screens/SocialStorySettingsScreen.tsx'),
  'utf8',
);
const shareWorkout = readFileSync(
  resolve(process.cwd(), 'src/features/social/screens/ShareWorkoutScreen.tsx'),
  'utf8',
);

describe('Social residual Liquid Glass materials', () => {
  it('uses active glass materials for Story push controls', () => {
    expect(storySettings).toContain('trackColor={{ false: glass.controlFill, true: glass.accentFill }}');
    expect(storySettings).not.toMatch(/colors\.surfacePrimary\b/);
  });

  it('uses active glass materials for workout-share controls', () => {
    expect(shareWorkout).toContain('thumbColor={Platform.OS === "android" ? glass.cardHighlight : undefined}');
    expect(shareWorkout).toContain('trackColor={{ false: glass.controlFill, true: glass.accentFill }}');
    expect(shareWorkout).not.toMatch(/colors\.(surfacePrimary|borderStrong)\b/);
  });
});
