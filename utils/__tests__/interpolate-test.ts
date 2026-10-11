import { interpolate } from '@/utils/interpolate';

describe('interpolate', () => {
  it('fills named placeholders', () => {
    expect(interpolate('Halo, {name}!', { name: 'lutfi' })).toBe('Halo, lutfi!');
    expect(interpolate('Hello, {name}!', { name: 'lutfi' })).toBe('Hello, lutfi!');
  });

  it('supports numbers and repeated placeholders', () => {
    expect(interpolate('{count} hari, {count} kali', { count: 3 })).toBe('3 hari, 3 kali');
  });

  it('leaves unknown placeholders visible', () => {
    expect(interpolate('Halo, {name}!', {})).toBe('Halo, {name}!');
  });

  it('returns the template untouched without params', () => {
    expect(interpolate('Halo, {name}!')).toBe('Halo, {name}!');
  });
});
