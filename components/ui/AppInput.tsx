import React, { type ReactNode, useState } from 'react';
import { TextInput, type TextInputProps, View, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { AppText } from './AppText';

export type AppInputProps = TextInputProps & {
  containerStyle?: ViewStyle;
  error?: string;
  label?: string;
  labelRight?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function AppInput({
  accessibilityLabel,
  containerStyle,
  error,
  label,
  labelRight,
  leftIcon,
  onBlur,
  onFocus,
  rightIcon,
  style,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const iconColor = isFocused ? colors.light.primary : colors.light.outline;

  const renderedLeftIcon = React.isValidElement(leftIcon)
    ? React.cloneElement(leftIcon as React.ReactElement<{ color?: string }>, {
        color: (leftIcon.props as { color?: string }).color === colors.light.primary ? colors.light.primary : iconColor,
      })
    : leftIcon;

  return (
    <View className="w-full" style={[{ gap: spacing[2] }, containerStyle]}>
      {label || labelRight ? (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {label ? (
            <AppText
              color={colors.light.text}
              style={{ fontFamily: typography.family.mono, fontSize: 14, lineHeight: 20 }}>
              {label}
            </AppText>
          ) : null}
          {labelRight}
        </View>
      ) : null}

      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.light.surfaceContainerLow,
          borderColor: error
            ? colors.light.danger
            : isFocused
              ? colors.light.primary
              : colors.light.outlineVariant,
          borderRadius: radius.lg,
          borderWidth: 1,
          flexDirection: 'row',
          gap: spacing[3],
          minHeight: 56,
          overflow: 'hidden',
          paddingHorizontal: spacing[3],
        }}>
        {renderedLeftIcon}
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          placeholderTextColor={colors.light.outline}
          style={[
            {
              color: colors.light.text,
              flex: 1,
              fontFamily: typography.family.sans,
              fontSize: 16,
              minHeight: 48,
              paddingVertical: 0,
            },
            style,
          ]}
          {...props}
        />
        {rightIcon}
      </View>

      {error ? (
        <AppText color={colors.light.danger} variant="caption">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
