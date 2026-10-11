import { render } from '@testing-library/react-native';

import { ThemedText } from '../themed-text';

function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean));
  }
  return (style ?? {}) as Record<string, unknown>;
}

describe('<ThemedText />', () => {
  test('renders its children', async () => {
    const { getByText } = await render(<ThemedText>Halo PemulaCode</ThemedText>);

    expect(getByText('Halo PemulaCode')).toBeTruthy();
  });

  test('applies the title style when type is title', async () => {
    const { getByText } = await render(<ThemedText type="title">Judul</ThemedText>);

    const flatStyle = flattenStyle(getByText('Judul').props.style);
    expect(flatStyle.fontSize).toBe(32);
    expect(flatStyle.fontWeight).toBe('bold');
  });

  test('lets a custom style override the default', async () => {
    const { getByText } = await render(<ThemedText style={{ fontSize: 99 }}>Custom</ThemedText>);

    const flatStyle = flattenStyle(getByText('Custom').props.style);
    expect(flatStyle.fontSize).toBe(99);
  });
});
