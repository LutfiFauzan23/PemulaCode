import { base64ToUint8Array, isBase64DataUri } from '@/utils/base64';

const text = (bytes: Uint8Array) => String.fromCharCode(...bytes);

describe('base64ToUint8Array', () => {
  it('decodes plain base64', () => {
    expect(text(base64ToUint8Array('aGVsbG8='))).toBe('hello');
    expect(text(base64ToUint8Array('Zm9v'))).toBe('foo');
  });

  it('decodes a data URI', () => {
    expect(text(base64ToUint8Array('data:image/png;base64,aGVsbG8='))).toBe('hello');
  });

  it('handles every 3-byte remainder', () => {
    expect(text(base64ToUint8Array('YQ=='))).toBe('a');
    expect(text(base64ToUint8Array('YWI='))).toBe('ab');
    expect(text(base64ToUint8Array('YWJj'))).toBe('abc');
  });

  it('returns an empty array for empty input', () => {
    expect(base64ToUint8Array('').length).toBe(0);
    expect(base64ToUint8Array('data:image/png;base64,').length).toBe(0);
  });

  it('round-trips binary bytes (JPEG magic header)', () => {
    // 0xFF 0xD8 0xFF 0xE0 dalam base64.
    expect(Array.from(base64ToUint8Array('/9j/4A=='))).toEqual([255, 216, 255, 224]);
  });
});

describe('isBase64DataUri', () => {
  it('detects data URIs only', () => {
    expect(isBase64DataUri('data:image/jpeg;base64,abc')).toBe(true);
    expect(isBase64DataUri('file:///tmp/a.jpg')).toBe(false);
    expect(isBase64DataUri('https://example.com/a.jpg')).toBe(false);
  });
});
