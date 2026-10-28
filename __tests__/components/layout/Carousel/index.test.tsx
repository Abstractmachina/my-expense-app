import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import Carousel from '@/components/layout/Carousel';

// rn-primitives ships untransformed ES modules that Jest cannot load, so Slot is stubbed as a pass-through.
jest.mock('@rn-primitives/slot', () => ({ Slot: ({ children }: { children: React.ReactNode }) => children }));

/**
 * Renders a three-page carousel with dots, mirroring how TagsPanel uses it.
 *
 * @returns {ReturnType<typeof render>} The render result
 */
const renderCarousel = () =>
  render(
    <Carousel>
      <Carousel.Content>
        <Carousel.Item>
          <Text>Page 1</Text>
        </Carousel.Item>
        <Carousel.Item>
          <Text>Page 2</Text>
        </Carousel.Item>
        <Carousel.Item>
          <Text>Page 3</Text>
        </Carousel.Item>
      </Carousel.Content>
      <Carousel.Dots />
    </Carousel>,
  );

describe('Carousel', () => {
  it('renders one dot per page', async () => {
    await renderCarousel();

    expect(screen.getAllByRole('button', { name: /Go to page/ })).toHaveLength(3);
  });

  it('marks the first page active by default', async () => {
    await renderCarousel();

    expect(screen.getByRole('button', { name: 'Go to page 1' }).props.className).toContain('bg-primary');
    expect(screen.getByRole('button', { name: 'Go to page 2' }).props.className).not.toContain('bg-primary');
  });

  it('marks a page active when its dot is tapped', async () => {
    await renderCarousel();

    await fireEvent.press(screen.getByRole('button', { name: 'Go to page 3' }));

    expect(screen.getByRole('button', { name: 'Go to page 3' }).props.className).toContain('bg-primary');
    expect(screen.getByRole('button', { name: 'Go to page 1' }).props.className).not.toContain('bg-primary');
  });

  it('updates the active dot when a swipe settles on a page', async () => {
    await renderCarousel();

    // momentumScrollEnd doesn't bubble in RN, so fire it on the ScrollView host element itself.
    let scrollView = screen.getByText('Page 1');
    while (!scrollView.props.onMomentumScrollEnd) scrollView = scrollView.parent!;
    await act(async () =>
      scrollView.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { x: 600 }, layoutMeasurement: { width: 300 } },
      }),
    );

    expect(screen.getByRole('button', { name: 'Go to page 3' }).props.className).toContain('bg-primary');
  });

  it('hides the dots when there is only one page', async () => {
    await render(
      <Carousel>
        <Carousel.Content>
          <Carousel.Item>
            <Text>Only page</Text>
          </Carousel.Item>
        </Carousel.Content>
        <Carousel.Dots />
      </Carousel>,
    );

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
