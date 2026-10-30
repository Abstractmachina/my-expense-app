import { render, screen } from '@testing-library/react-native';

import Overview from '@/components/screens/Overview';

// The theme imports global.css, which Jest cannot parse, so the themed components are stubbed.
jest.mock('@/components/styled-components/themed-text', () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text: MockText } = jest.requireActual('react-native');
    return <MockText>{children}</MockText>;
  },
}));

jest.mock('@/components/styled-components/themed-view', () => ({
  ThemedView: ({ children }: { children: React.ReactNode }) => {
    const { View: MockView } = jest.requireActual('react-native');
    return <MockView>{children}</MockView>;
  },
}));

describe('Overview', () => {
  it('shows a placeholder panel for each summary figure', async () => {
    await render(<Overview />);

    expect(screen.getByText('Total this month')).toBeTruthy();
    expect(screen.getByText('Daily average')).toBeTruthy();
    expect(screen.getByText('Top category')).toBeTruthy();
    expect(screen.getByText('Expenses logged')).toBeTruthy();
  });
});
