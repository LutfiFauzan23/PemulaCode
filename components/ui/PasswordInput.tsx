import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';

import { colors } from '@/constants/colors';
import { AppInput, type AppInputProps } from './AppInput';

export type PasswordInputProps = Omit<AppInputProps, 'rightIcon' | 'secureTextEntry'>;

export function PasswordInput({ leftIcon, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AppInput
      leftIcon={leftIcon ?? <Lock color={colors.light.outline} size={20} />}
      rightIcon={
        <Pressable
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setShowPassword((prev) => !prev)}>
          {showPassword ? (
            <EyeOff color={colors.light.outline} size={20} />
          ) : (
            <Eye color={colors.light.outline} size={20} />
          )}
        </Pressable>
      }
      secureTextEntry={!showPassword}
      {...props}
    />
  );
}
