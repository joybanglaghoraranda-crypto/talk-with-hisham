import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatTimestamp } from './utils';

describe('formatTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set fixed time to: 2024-05-15T14:30:00.000Z (May 15, 2024, 2:30 PM UTC)
    vi.setSystemTime(new Date('2024-05-15T14:30:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "Just now" for dates less than 1 minute ago', () => {
    const date1 = new Date('2024-05-15T14:29:30.000Z').toISOString();
    expect(formatTimestamp(date1)).toBe('Just now');
    
    const date2 = new Date('2024-05-15T14:30:00.000Z').toISOString();
    expect(formatTimestamp(date2)).toBe('Just now');
  });

  it('should return "Xm ago" for dates between 1 and 59 minutes ago', () => {
    const date1 = new Date('2024-05-15T14:29:00.000Z').toISOString();
    expect(formatTimestamp(date1)).toBe('1m ago');

    const date2 = new Date('2024-05-15T14:25:00.000Z').toISOString();
    expect(formatTimestamp(date2)).toBe('5m ago');

    const date3 = new Date('2024-05-15T13:31:00.000Z').toISOString();
    expect(formatTimestamp(date3)).toBe('59m ago');
  });

  it('should return "Today X:XX AM/PM" for dates earlier today (>= 60 mins ago)', () => {
    // 60 minutes ago
    const date1 = new Date('2024-05-15T13:30:00.000Z');
    const expectedTime1 = date1.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(date1.toISOString())).toBe(`Today ${expectedTime1}`);

    // earlier in the day
    const date2 = new Date('2024-05-15T09:15:00.000Z');
    const expectedTime2 = date2.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(date2.toISOString())).toBe(`Today ${expectedTime2}`);
  });

  it('should return "Month Day X:XX AM/PM" for dates from previous days', () => {
    // Yesterday
    const date1 = new Date('2024-05-14T14:30:00.000Z');
    const expectedDateStr1 = date1.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const expectedTime1 = date1.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(date1.toISOString())).toBe(`${expectedDateStr1} ${expectedTime1}`);

    // Last month
    const date2 = new Date('2024-04-15T14:30:00.000Z');
    const expectedDateStr2 = date2.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const expectedTime2 = date2.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(date2.toISOString())).toBe(`${expectedDateStr2} ${expectedTime2}`);
    
    // Last year
    const date3 = new Date('2023-05-15T14:30:00.000Z');
    const expectedDateStr3 = date3.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const expectedTime3 = date3.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    expect(formatTimestamp(date3.toISOString())).toBe(`${expectedDateStr3} ${expectedTime3}`);
  });
});
