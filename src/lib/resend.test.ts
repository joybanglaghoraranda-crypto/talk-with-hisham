import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendEmail } from './resend';

// Mock global fetch
global.fetch = vi.fn();

describe('sendEmail', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Spy on console.error to avoid noise in the test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should successfully send an email', async () => {
    const mockResponse = { success: true };
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      }),
    });
  });

  it('should throw an error if response is not ok and contains error.message', async () => {
    const mockErrorResponse = { error: { message: 'Failed due to validation' } };
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    })).rejects.toThrow('Failed due to validation');

    expect(console.error).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
  });

  it('should throw an error if response is not ok and contains error string', async () => {
    const mockErrorResponse = { error: 'Failed due to rate limit' };
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    })).rejects.toThrow('Failed due to rate limit');
  });

  it('should throw a default error if response is not ok and contains no specific error message', async () => {
    const mockErrorResponse = {};
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    })).rejects.toThrow('Failed to send email');
  });

  it('should throw an error if fetch throws an exception', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test HTML</p>',
    })).rejects.toThrow('Network error');

    expect(console.error).toHaveBeenCalledWith('Error sending email:', expect.any(Error));
  });
});
