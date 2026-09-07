import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '@/context/ThemeContext';
import { AppInput, type AppInputProps } from './AppInput';

export type PasswordInputProps = Omit<AppInputProps, 'rightIcon' | 'secureTextEntry'>;

export function PasswordInput({ leftIcon, ...props }: PasswordInputProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppInput
      leftIcon={leftIcon ?? <Lock color={colors.outline} size={20} />}
      rightIcon={
        <Pressable
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setShowPassword((prev) => !prev)}>
          {showPassword ? (
            <EyeOff color={colors.outline} size={20} />
          ) : (
            <Eye color={colors.outline} size={20} />
          )}
        </Pressable>
      }
      secureTextEntry={!showPassword}
      {...props}
    />
  );
}
