import { formatCurrency } from '@/util/currency/format-currency';

describe('formatCurrency', () => {
  it('uses the euro sign by default', () => {
    expect(formatCurrency(12.5)).toBe('€12.50');
  });

  it('uses the euro sign for eur', () => {
    expect(formatCurrency(12.5, { currency: 'eur' })).toBe('€12.50');
  });

  it('uses the dollar sign for usd', () => {
    expect(formatCurrency(12.5, { currency: 'usd' })).toBe('$12.50');
  });

  it('omits the symbol when noSymbol is true', () => {
    expect(formatCurrency(12.5, { noSymbol: true })).toBe('12.50');
  });

  it('rounds to two decimals', () => {
    expect(formatCurrency(3.14159)).toBe('€3.14');
    expect(formatCurrency(0)).toBe('€0.00');
  });
});
