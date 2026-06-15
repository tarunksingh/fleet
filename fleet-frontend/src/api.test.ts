import { describe, expect, it } from 'vitest';

function formatVehicleLabel(registration: string, type: string) {
  return `${registration} (${type})`;
}

describe('utility helpers', () => {
  it('formats vehicle label correctly', () => {
    expect(formatVehicleLabel('TRK-101', 'Tanker')).toBe('TRK-101 (Tanker)');
  });
});
