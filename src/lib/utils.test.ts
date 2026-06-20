import { describe, it, expect } from 'vitest';
import { getInitials } from './utils';

describe('getInitials', () => {
  it('returns "?" for undefined', () => {
    expect(getInitials(undefined)).toBe('?');
  });

  it('returns "?" for null', () => {
    expect(getInitials(null)).toBe('?');
  });

  it('returns "?" for an empty string', () => {
    expect(getInitials('')).toBe('?');
  });

  it('returns "?" for a string containing only spaces', () => {
    expect(getInitials('   ')).toBe('?');
  });

  it('returns the first letter capitalized for a single word', () => {
    expect(getInitials('john')).toBe('J');
  });

  it('returns the first letter of the first two words capitalized', () => {
    expect(getInitials('john doe')).toBe('JD');
  });

  it('handles multiple words and only takes the first two initials', () => {
    expect(getInitials('john robert doe')).toBe('JR');
  });

  it('handles extra spaces between words', () => {
    expect(getInitials('john   doe')).toBe('JD');
  });

  it('handles leading and trailing spaces', () => {
    expect(getInitials('  john doe  ')).toBe('JD');
  });

  it('maintains capitalization if already capitalized', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });
});
