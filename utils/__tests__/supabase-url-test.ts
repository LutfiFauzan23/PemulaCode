import {
  describeSupabaseConfigIssue,
  isSupabaseOrigin,
  normalizeSupabaseUrl,
  SUPABASE_NOT_CONFIGURED_MESSAGE,
  SUPABASE_URL_DASHBOARD_MESSAGE,
  SUPABASE_URL_INVALID_MESSAGE,
} from '@/utils/supabase-url';

describe('normalizeSupabaseUrl', () => {
  it('strips a trailing /rest/v1 path (the real bug that broke sign-up)', () => {
    expect(normalizeSupabaseUrl('https://abc.supabase.co/rest/v1/')).toBe(
      'https://abc.supabase.co',
    );
  });

  it('strips other endpoint paths and trailing slashes', () => {
    expect(normalizeSupabaseUrl('https://abc.supabase.co/auth/v1')).toBe('https://abc.supabase.co');
    expect(normalizeSupabaseUrl('https://abc.supabase.co/')).toBe('https://abc.supabase.co');
    expect(normalizeSupabaseUrl('  https://abc.supabase.co  ')).toBe('https://abc.supabase.co');
  });

  it('leaves an already-correct origin untouched', () => {
    expect(normalizeSupabaseUrl('https://abc.supabase.co')).toBe('https://abc.supabase.co');
  });

  it('returns an empty string for empty input', () => {
    expect(normalizeSupabaseUrl('')).toBe('');
    expect(normalizeSupabaseUrl('   ')).toBe('');
  });
});

describe('isSupabaseOrigin', () => {
  it('accepts origins and rejects paths', () => {
    expect(isSupabaseOrigin('https://abc.supabase.co')).toBe(true);
    expect(isSupabaseOrigin('http://127.0.0.1:54321')).toBe(true);
    expect(isSupabaseOrigin('https://abc.supabase.co/rest/v1')).toBe(false);
    expect(isSupabaseOrigin('abc.supabase.co')).toBe(false);
  });
});

describe('describeSupabaseConfigIssue', () => {
  it('reports missing configuration', () => {
    expect(describeSupabaseConfigIssue('', '')).toBe(SUPABASE_NOT_CONFIGURED_MESSAGE);
  });

  it('catches a dashboard URL pasted by mistake', () => {
    expect(
      describeSupabaseConfigIssue('https://supabase.com/dashboard/project/abc', 'key'),
    ).toBe(SUPABASE_URL_DASHBOARD_MESSAGE);
  });

  it('catches a URL that still contains a path', () => {
    expect(describeSupabaseConfigIssue('https://abc.supabase.co/rest/v1', 'key')).toBe(
      SUPABASE_URL_INVALID_MESSAGE,
    );
  });

  it('returns null for a valid origin + key', () => {
    expect(describeSupabaseConfigIssue('https://abc.supabase.co', 'sb_publishable_x')).toBeNull();
  });
});
