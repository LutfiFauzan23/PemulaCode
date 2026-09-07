import { Lightbulb, Terminal } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';

export type SectionData = {
  type: 'heading' | 'paragraph' | 'tip' | 'code' | 'subheading';
  content?: string;
  title?: string;
  language?: string;
  filename?: string;
  code?: string;
};

type Props = {
  section: SectionData;
  accentColor?: string;
  accentFixed?: string;
};

export function LessonSection({ section, accentColor, accentFixed }: Props) {
  const { colors: c, mode } = useTheme();
  const effectiveAccent = accentColor ?? c.primary;

  switch (section.type) {
    case 'heading':
      return (
        <AppText
          color={effectiveAccent}
          style={{
            fontFamily: typography.family.sansBold,
            fontSize: 22,
            lineHeight: 30,
            marginTop: spacing[4],
            marginBottom: spacing[2],
          }}>
          {section.content}
        </AppText>
      );

    case 'subheading':
      return (
        <AppText
          color={c.text}
          style={{
            fontFamily: typography.family.sansBold,
            fontSize: 18,
            lineHeight: 25,
            marginTop: spacing[4],
            marginBottom: spacing[2],
          }}>
          {section.content}
        </AppText>
      );

    case 'paragraph':
      return (
        <AppText
          color={c.text}
          style={{
            fontSize: 15,
            lineHeight: 24,
            marginBottom: spacing[3],
          }}>
          {section.content}
        </AppText>
      );

    case 'tip':
      return (
        <View
          style={{
            backgroundColor: mode === 'dark' ? '#2d2305' : '#FFFBEB',
            borderColor: mode === 'dark' ? '#5c480a' : '#FCD34D',
            borderLeftColor: '#F59E0B',
            borderLeftWidth: 4,
            borderRadius: radius.xl,
            borderWidth: 1,
            padding: spacing[4],
            marginVertical: spacing[3],
          }}>
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2], marginBottom: spacing[1] }}>
            <Lightbulb color="#D97706" size={18} />
            <AppText
              color={mode === 'dark' ? '#fbbf24' : '#B45309'}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 15,
              }}>
              {section.title || 'Tahukah Kamu?'}
            </AppText>
          </View>
          <AppText
            color={mode === 'dark' ? '#fef3c7' : '#92400E'}
            style={{
              fontSize: 14,
              lineHeight: 21,
            }}>
            {section.content}
          </AppText>
        </View>
      );

    case 'code':
      return (
        <View
          style={{
            backgroundColor: '#1E1E2E',
            borderRadius: radius.xl,
            marginVertical: spacing[4],
            overflow: 'hidden',
          }}>
          {/* Header bar with window controls & filename */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#181825',
              borderBottomColor: '#313244',
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
            }}>
            {/* Traffic dots */}
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <View style={{ backgroundColor: '#F38BA8', borderRadius: 6, height: 10, width: 10 }} />
              <View style={{ backgroundColor: '#F9E2AF', borderRadius: 6, height: 10, width: 10 }} />
              <View style={{ backgroundColor: '#A6E3A1', borderRadius: 6, height: 10, width: 10 }} />
            </View>

            {/* Filename */}
            {section.filename && (
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
                <Terminal color="#CDD6F4" size={12} />
                <AppText
                  color="#CDD6F4"
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 12,
                  }}>
                  {section.filename}
                </AppText>
              </View>
            )}
          </View>

          {/* Code Content ScrollView (Horizontal for overflow code) */}
          <ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{ padding: spacing[4] }}>
            <AppText
              color="#CDD6F4"
              style={{
                fontFamily: typography.family.mono,
                fontSize: 13,
                lineHeight: 22,
              }}>
              {section.code}
            </AppText>
          </ScrollView>
        </View>
      );

    default:
      return null;
  }
}
