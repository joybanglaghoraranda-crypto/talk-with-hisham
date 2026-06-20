import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimestamp } from './utils';

describe('formatTimestamp', () => {
  const MOCK_DATE = new Date('2024-01-15T12:00:00.000Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" when the difference is less than 1 minute', () => {
    // 30 seconds ago
    const dateStr = new Date(MOCK_DATE.getTime() - 30 * 1000).toISOString();
    expect(formatTimestamp(dateStr)).toBe('Just now');
  });

  it('returns "Xm ago" when the difference is less than 60 minutes', () => {
    // 55 minutes ago
    const dateStr = new Date(MOCK_DATE.getTime() - 55 * 60 * 1000).toISOString();
    expect(formatTimestamp(dateStr)).toBe('55m ago');
  });

  it('returns "Today HH:MM AM/PM" when the difference is >= 60 minutes but on the same day', () => {
    // 3 hours ago
    const pastDate = new Date(MOCK_DATE.getTime() - 3 * 60 * 60 * 1000);
    const dateStr = pastDate.toISOString();

    const timeString = pastDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(dateStr)).toBe(`Today ${timeString}`);
  });

  it('returns "MMM DD HH:MM AM/PM" when the date is not today', () => {
    // 2 days ago
    const pastDate = new Date(MOCK_DATE.getTime() - 48 * 60 * 60 * 1000);
    const dateStr = pastDate.toISOString();

    const dateString = pastDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const timeString = pastDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(dateStr)).toBe(`${dateString} ${timeString}`);
  });
});
