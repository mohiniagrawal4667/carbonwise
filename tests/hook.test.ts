import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateStreak } from '../src/hooks/useCarbonWise';

describe('Custom useCarbonWise Helper Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('correctly calculates consecutive day streak on sorted completed dates', () => {
    // Mocking date context
    const mockToday = new Date('2026-06-14T12:00:00Z');
    vi.setSystemTime(mockToday);

    // If completed on 14th, 13th, 12th -> streak is 3
    const completedDates = ['2026-06-14', '2026-06-13', '2026-06-12'];
    const streak = calculateStreak(completedDates);
    expect(streak).toBe(3);
  });

  it('breaks streak when a gap exists between dates', () => {
    // Set simulated system time to June 14
    const mockToday = new Date('2026-06-14T12:00:00Z');
    vi.setSystemTime(mockToday);

    // Completed today and June 11th - gap of 12th/13th
    const completedDates = ['2026-06-14', '2026-06-11'];
    const streak = calculateStreak(completedDates);
    expect(streak).toBe(1);
  });

  it('declares streak as zero when last completed date is too old', () => {
    // Simulated system time to June 14
    const mockToday = new Date('2026-06-14T12:00:00Z');
    vi.setSystemTime(mockToday);

    // Completed last on June 10th - broken
    const completedDates = ['2026-06-10', '2026-06-09'];
    const streak = calculateStreak(completedDates);
    expect(streak).toBe(0);
  });

  it('handles multiple tasks completed on the same date cleanly without double counting streak', () => {
    const mockToday = new Date('2026-06-14T12:00:00Z');
    vi.setSystemTime(mockToday);

    // Multiple challenges completed on the same day
    const completedDates = ['2026-06-14', '2026-06-14', '2026-06-13', '2026-06-13'];
    const streak = calculateStreak(completedDates);
    expect(streak).toBe(2);
  });
});
