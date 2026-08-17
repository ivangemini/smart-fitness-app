import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'src/components/workouts/WorkoutHistorySessionCard.tsx'),
  'utf8',
);

describe('workout history Liquid Glass source contract', () => {
  it('keeps editable set fields on palette-owned control material', () => {
    expect(source).toContain('resolveLiquidGlassPalette(resolvedAppearance)');
    expect(source).toContain('backgroundColor: glass.controlFill');
    expect(source).toContain('borderColor: glass.controlBorder');
    expect(source).toContain('borderWidth: StyleSheet.hairlineWidth');
    expect(source).not.toContain('backgroundColor: colors.backgroundSecondary');
  });
});
