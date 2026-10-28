import { fireEvent, render, screen } from '@testing-library/react-native';

import { Textarea } from '@/components/inputs/TextArea';

describe('Textarea', () => {
  it('renders a multiline input with the placeholder and value', async () => {
    await render(<Textarea placeholder="Notes" value="Lunch" />);

    const input = screen.getByPlaceholderText('Notes');
    expect(input.props.multiline).toBe(true);
    expect(input.props.value).toBe('Lunch');
  });

  it('reports text changes to onChangeText', async () => {
    const onChangeText = jest.fn();
    await render(<Textarea placeholder="Notes" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByPlaceholderText('Notes'), 'Coffee');
    expect(onChangeText).toHaveBeenCalledWith('Coffee');
  });

  it('grows to the height of its content', async () => {
    await render(<Textarea placeholder="Notes" />);

    await fireEvent(screen.getByPlaceholderText('Notes'), 'contentSizeChange', {
      nativeEvent: { contentSize: { width: 300, height: 120 } },
    });
    expect(screen.getByPlaceholderText('Notes')).toHaveStyle({ height: 120 });
  });

  it('still calls the consumer onContentSizeChange', async () => {
    const onContentSizeChange = jest.fn();
    await render(<Textarea placeholder="Notes" onContentSizeChange={onContentSizeChange} />);

    const event = { nativeEvent: { contentSize: { width: 300, height: 90 } } };
    await fireEvent(screen.getByPlaceholderText('Notes'), 'contentSizeChange', event);
    expect(onContentSizeChange).toHaveBeenCalledWith(expect.objectContaining(event));
  });

  it('passes editable through to the input', async () => {
    await render(<Textarea placeholder="Notes" editable={false} />);

    expect(screen.getByPlaceholderText('Notes').props.editable).toBe(false);
  });
});
