import type { ViewProps, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';
import { spacing } from '@/constants/spacing';

export type ScreenContainerProps = ViewProps & {
  className?: string;
  padded?: boolean;
  /**
   * Warna area di bawah status bar. Default mengikuti latar layar; layar
   * dengan banner berwarna (mis. login/register) mengirim warna banner supaya
   * banner menempel penuh ke tepi atas — tidak ada lagi strip latar terang di
   * atas banner yang membuat tampilan "tidak full".
   */
  topColor?: string;
};

/** Ambil `backgroundColor` dari style (termasuk array style). */
function backgroundColorOf(style: unknown): string | undefined {
  if (!style) return undefined;
  if (Array.isArray(style)) {
    for (let i = style.length - 1; i >= 0; i -= 1) {
      const found = backgroundColorOf(style[i]);
      if (found) return found;
    }
    return undefined;
  }
  if (typeof style === 'object' && 'backgroundColor' in style) {
    const bg = (style as { backgroundColor?: unknown }).backgroundColor;
    return typeof bg === 'string' ? bg : undefined;
  }
  return undefined;
}

export function ScreenContainer({
  children,
  className,
  padded = true,
  style,
  topColor,
  ...props
}: ScreenContainerProps) {
  const { colors: c } = useTheme();

  const contentBg = backgroundColorOf(style) ?? c.background;

  const containerStyle: ViewStyle = {
    backgroundColor: c.background,
    flex: 1,
    paddingHorizontal: padded ? spacing[4] : 0,
    paddingVertical: padded ? spacing[4] : 0,
  };

  return (
    // SafeAreaView hanya bertugas memberi padding status bar. Warna strip di
    // bawah status bar bisa di-override lewat `topColor`; konten (dengan
    // padding dan warnanya sendiri) berada di lapisan di dalamnya.
    // `app/(tabs)/_layout.tsx` tidak menambahkan inset, jadi tiap layar
    // mendapat tepat satu padding status bar.
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: topColor ?? contentBg, flex: 1 }}
      {...props}>
      <View className={className} style={[containerStyle, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
