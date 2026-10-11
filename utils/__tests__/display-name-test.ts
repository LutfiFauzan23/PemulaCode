import { getDisplayName } from '@/utils/display-name';

describe('getDisplayName', () => {
  it('prefers the profile username (nickname set at sign-up or in settings)', () => {
    expect(getDisplayName('lutfi', 'ignored')).toBe('lutfi');
  });

  it('falls back to the sign-up metadata when the profile is not loaded yet', () => {
    expect(getDisplayName(undefined, 'lutfi')).toBe('lutfi');
    expect(getDisplayName(null, 'lutfi')).toBe('lutfi');
    expect(getDisplayName('   ', 'lutfi')).toBe('lutfi');
  });

  it('trims surrounding whitespace', () => {
    expect(getDisplayName('  lutfi  ', '')).toBe('lutfi');
    expect(getDisplayName(undefined, '  lutfi  ')).toBe('lutfi');
  });

  it('returns null when there is no nickname at all, so the caller can greet generically', () => {
    expect(getDisplayName(undefined, undefined)).toBeNull();
    expect(getDisplayName(null, null)).toBeNull();
    expect(getDisplayName('', '   ')).toBeNull();
    expect(getDisplayName(undefined, 42)).toBeNull();
  });
});
