import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (Class Name Utility)', () => {
  it('merges basic classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('handles object syntax for conditional classes', () => {
    expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2');
  });

  it('handles falsy values gracefully', () => {
    expect(cn('class1', null, undefined, false, 0, '')).toBe('class1');
  });

  it('handles array inputs', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles complex nested inputs', () => {
    expect(cn(
      'base-class',
      ['nested-class', { 'conditional-true': true, 'conditional-false': false }],
      'p-4',
      'p-8',
      null,
      undefined
    )).toBe('base-class nested-class conditional-true p-8');
  });
});
