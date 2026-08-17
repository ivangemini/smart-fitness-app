import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Social profile busy-state source contract', () => {
  it('freezes profile fields and visibility during save or avatar mutation', () => {
    const source = read('src/features/social/screens/SocialProfileEditorScreen.tsx');
    expect(source).toContain('const editingDisabled = saving || avatarBusy;');
    expect(source.match(/editable=\{!editingDisabled\}/g)?.length).toBe(3);
    expect(source).toContain('disabled={editingDisabled}');
    expect(source).toContain('disabled={saving}');
    expect(source).toContain('if (editingDisabled) return;');
  });

  it('lets SegmentedControl expose a real disabled state', () => {
    const source = read('src/components/ui/SegmentedControl.tsx');
    expect(source).toContain('disabled?: boolean;');
    expect(source).toContain('disabled={disabled}');
    expect(source).toContain('backgroundColor: glass.disabledFill');
    expect(source).toContain('borderColor: glass.disabledBorder');
  });

  it('lets the avatar card honor a parent mutation lock', () => {
    const source = read('src/features/social/SocialManagedAvatarCard.tsx');
    expect(source).toContain('disabled?: boolean;');
    expect(source).toContain('const controlsDisabled = busy || disabled;');
    expect(source).toContain('disabled={!controller.profileExists || controlsDisabled}');
  });
});
