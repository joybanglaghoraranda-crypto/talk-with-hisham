import { getDateLabel } from '../utils';

describe('getDateLabel', () => {
  const fixedDate = new Date('2024-01-15T12:00:00Z'); // Monday, January 15, 2024

  beforeAll(() => {
    // Mock the system date to ensuring tests are deterministic
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns "Today" for the current date', () => {
    expect(getDateLabel('2024-01-15T08:00:00Z')).toBe('Today');
    expect(getDateLabel('2024-01-15T23:59:59Z')).toBe('Today');
  });

  it('returns "Yesterday" for the previous date', () => {
    expect(getDateLabel('2024-01-14T10:00:00Z')).toBe('Yesterday');
    expect(getDateLabel('2024-01-14T23:59:59Z')).toBe('Yesterday');
  });

  it('returns formatted date for dates before yesterday', () => {
    // 2 days ago
    expect(getDateLabel('2024-01-13T12:00:00Z')).toBe('Saturday, January 13');
    // 1 month ago
    expect(getDateLabel('2023-12-15T12:00:00Z')).toBe('Friday, December 15');
    // 1 year ago
    expect(getDateLabel('2023-01-15T12:00:00Z')).toBe('Sunday, January 15');
  });

  it('returns formatted date for future dates', () => {
    // Tomorrow
    expect(getDateLabel('2024-01-16T12:00:00Z')).toBe('Tuesday, January 16');
  });
});
