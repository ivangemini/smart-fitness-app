import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8');

const route = read('src/app/settings/notifications.tsx');
const copy = read('src/localization/notificationSettingsCopy.ts');

describe('notification settings localization ownership', () => {
  it('keeps RU/EN user-facing copy out of the route', () => {
    expect(route).toContain('getNotificationSettingsCopy(locale)');
    expect(route).not.toContain("locale.toLowerCase().startsWith('ru')");
    expect(route).not.toContain("'Уведомления'");
    expect(route).not.toContain("'Notifications'");
  });

  it('owns notification permission and registration labels in canonical copy', () => {
    expect(copy).toContain('permissionAllowed');
    expect(copy).toContain('permissionDenied');
    expect(copy).toContain('registrationRegistered');
    expect(copy).toContain('registrationError');
    expect(copy).toContain('syncDevice');
  });
});
