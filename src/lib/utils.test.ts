import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime } from './utils';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    // Set system time to a fixed date for deterministic tests
    // Using May 15, 2024 at 12:00:00 UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-05-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for times less than 1 minute ago', () => {
    // 30 seconds ago
    const date = new Date('2024-05-15T11:59:30Z');
    expect(formatRelativeTime(date.toISOString())).toBe('Just now');
  });

  it('returns minutes ago for times less than 1 hour ago', () => {
    // 5 minutes ago
    const date = new Date('2024-05-15T11:55:00Z');
    expect(formatRelativeTime(date.toISOString())).toBe('5m ago');

    // 59 minutes ago
    const date2 = new Date('2024-05-15T11:01:00Z');
    expect(formatRelativeTime(date2.toISOString())).toBe('59m ago');
  });

  it('returns hours ago for times less than 24 hours ago', () => {
    // 1 hour ago
    const date = new Date('2024-05-15T11:00:00Z');
    expect(formatRelativeTime(date.toISOString())).toBe('1h ago');

    // 23 hours ago
    const date2 = new Date('2024-05-14T13:00:00Z');
    expect(formatRelativeTime(date2.toISOString())).toBe('23h ago');
  });

  it('returns days ago for times less than 7 days ago', () => {
    // 1 day ago
    const date = new Date('2024-05-14T12:00:00Z');
    expect(formatRelativeTime(date.toISOString())).toBe('1d ago');

    // 6 days ago
    const date2 = new Date('2024-05-09T12:00:00Z');
    expect(formatRelativeTime(date2.toISOString())).toBe('6d ago');
  });

  it('returns formatted date string for times 7 days or older', () => {
    // 7 days ago -> May 8
    const date = new Date('2024-05-08T12:00:00Z');
    expect(formatRelativeTime(date.toISOString())).toBe('May 8');

    // 30 days ago -> Apr 15
    const date2 = new Date('2024-04-15T12:00:00Z');
    expect(formatRelativeTime(date2.toISOString())).toBe('Apr 15');
  });
});
