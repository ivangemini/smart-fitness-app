import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readSource = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const home = readSource('src/app/(tabs)/index.tsx');
const profile = readSource('src/app/(tabs)/profile.tsx');
const discovery = readSource('src/features/social/screens/SocialProfileLookupScreen.tsx');
const settings = readSource('src/app/settings/index.tsx');
const updates = readSource('src/app/settings/updates.tsx');

describe('home social navigation and OTA controls', () => {
  it('uses search and notifications actions without the Home title', () => {
    expect(home).toContain("Icon={Search}");
    expect(home).toContain("router.push('/social')");
    expect(home).toContain("Icon={Bell}");
    expect(home).toContain("router.push('/social/notifications')");
    expect(home).not.toContain("<Text style={styles.headerTitle}>{t('tabs.home')}</Text>");
  });

  it('moves social shortcuts out of the profile screen', () => {
    expect(profile).not.toContain('SocialProfileEntryCard');
  });

  it('consolidates profile discovery and subscriptions', () => {
    expect(discovery).toContain("type DiscoveryTab = 'profiles' | 'communities' | 'subscriptions'");
    expect(discovery).toContain("router.push('/settings/social-profile')");
    expect(discovery).toContain("router.push('/social/relationships')");
    expect(discovery).toContain("router.push('/social/feed')");
    expect(discovery).toContain("router.push('/social/guidelines')");
  });

  it('restores a normal settings entry for OTA update checks', () => {
    expect(settings).toContain("router.push('/settings/updates')");
    expect(updates).toContain('Updates.checkForUpdateAsync()');
    expect(updates).toContain('Updates.fetchUpdateAsync()');
    expect(updates).toContain('Updates.reloadAsync()');
  });
});
