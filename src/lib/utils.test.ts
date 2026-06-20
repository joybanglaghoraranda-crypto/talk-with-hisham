import { describe, it, expect } from 'vitest';
import { sanitizeUrl } from './utils';

describe('sanitizeUrl', () => {
  it('returns empty string for falsy values', () => {
    expect(sanitizeUrl(null)).toBe('');
    expect(sanitizeUrl(undefined)).toBe('');
    expect(sanitizeUrl('')).toBe('');
  });

  it('allows valid http and https urls', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    expect(sanitizeUrl('https://example.com/path?query=1')).toBe('https://example.com/path?query=1');
  });

  it('allows blob and data:image urls', () => {
    expect(sanitizeUrl('blob:http://localhost:3000/123-456')).toBe('blob:http://localhost:3000/123-456');
    expect(sanitizeUrl('data:image/png;base64,iVBORw0KGgo')).toBe('data:image/png;base64,iVBORw0KGgo');
    expect(sanitizeUrl('data:image/jpeg;base64,abc')).toBe('data:image/jpeg;base64,abc');
  });

  it('allows relative paths starting with / and a letter', () => {
    expect(sanitizeUrl('/about')).toBe('/about');
    expect(sanitizeUrl('/images/logo.png')).toBe('/images/logo.png');
    expect(sanitizeUrl('/A')).toBe('/A');
  });

  it('trims whitespace around urls', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
    expect(sanitizeUrl('\n/about\t')).toBe('/about');
  });

  it('rejects malicious protocols', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('rejects relative paths that might be protocol-relative', () => {
    expect(sanitizeUrl('//example.com')).toBe('');
    expect(sanitizeUrl('///example.com')).toBe('');
  });

  it('rejects relative paths that do not start with a letter after slash', () => {
    // Current regex is `/\/[a-zA-Z]/`, so it expects a letter right after the slash
    expect(sanitizeUrl('/123')).toBe('');
    expect(sanitizeUrl('/.hidden')).toBe('');
    expect(sanitizeUrl('/-dash')).toBe('');
  });

  it('is case-insensitive for allowed protocols', () => {
    expect(sanitizeUrl('HTTPS://EXAMPLE.COM')).toBe('HTTPS://EXAMPLE.COM');
    expect(sanitizeUrl('Blob:http://localhost')).toBe('Blob:http://localhost');
    expect(sanitizeUrl('DATA:IMAGE/PNG;BASE64,')).toBe('DATA:IMAGE/PNG;BASE64,');
  });
});
