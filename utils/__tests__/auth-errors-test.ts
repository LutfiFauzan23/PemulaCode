import { friendlyAuthError } from '@/utils/auth-errors';

describe('friendlyAuthError', () => {
  it('explains the PGRST125 URL path error', () => {
    const result = friendlyAuthError('Invalid path specified in request URL');
    expect(result).toContain('Project URL');
    expect(result).toContain('/rest/v1');
  });

  it('explains an already-registered email', () => {
    expect(friendlyAuthError('User already registered')).toContain('sudah terdaftar');
  });

  it('explains network failures', () => {
    expect(friendlyAuthError('Failed to fetch')).toContain('koneksi internet');
  });

  it('explains an invalid key', () => {
    expect(friendlyAuthError('Invalid API key')).toContain('Publishable key');
  });

  it('explains an unconfirmed email', () => {
    expect(friendlyAuthError('Email not confirmed')).toContain('Confirm email');
  });

  it('passes unknown messages through unchanged', () => {
    expect(friendlyAuthError('Something unexpected')).toBe('Something unexpected');
  });
});
