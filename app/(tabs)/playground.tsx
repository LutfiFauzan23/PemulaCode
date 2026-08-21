import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Check,
  Code,
  Code2,
  Copy,
  Eye,
  Globe,
  Palette,
  Play,
  Terminal,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

type LanguageKey = 'html' | 'css' | 'js';

interface CodeSnippet {
  code: string;
  filename: string;
}

const INITIAL_CODE: Record<LanguageKey, CodeSnippet> = {
  html: {
    filename: 'index.html',
    code: `<div class="hero">
  <h1>Hello, Coder!</h1>
  <p>Welcome to the playground.</p>
</div>`,
  },
  css: {
    filename: 'styles.css',
    code: `.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}`,
  },
  js: {
    filename: 'main.js',
    code: `console.log("Hello, World!");

function greet() {
  alert("Welcome to Pemula!");
}`,
  },
};

export default function PlaygroundScreen() {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<LanguageKey>('html');
  const [codeMap, setCodeMap] = useState<Record<LanguageKey, string>>({
    html: INITIAL_CODE.html.code,
    css: INITIAL_CODE.css.code,
    js: INITIAL_CODE.js.code,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<number | null>(null);

  const currentFilename = INITIAL_CODE[activeLang].filename;
  const currentCode = codeMap[activeLang];

  const handleCodeChange = (text: string) => {
    setCodeMap((prev) => ({
      ...prev,
      [activeLang]: text,
    }));
  };

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunCode = () => {
    setLastRunTime(Date.now());
  };

  // Helper to parse HTML heading and paragraph from user code
  const getParsedHtml = () => {
    const html = codeMap.html;
    const h1Match = html.match(/<h1>(.*?)<\/h1>/i);
    const pMatch = html.match(/<p>(.*?)<\/p>/i);
    return {
      h1: h1Match ? h1Match[1] : 'Hello, Coder!',
      p: pMatch ? pMatch[1] : 'Welcome to the playground.',
    };
  };

  const parsedPreview = getParsedHtml();

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
          
          {/* 1. TOP APP BAR */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.background,
              flexDirection: 'row',
              height: 60,
              justifyContent: 'space-between',
              paddingHorizontal: spacing[5],
              paddingTop: spacing[2],
            }}>
            {/* Left: Avatar + Title */}
            <Pressable
              accessibilityLabel="Profile Avatar"
              accessibilityRole="button"
              style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
              <View
                style={{
                  borderColor: colors.light.primary,
                  borderRadius: radius.full,
                  borderWidth: 2,
                  height: 40,
                  overflow: 'hidden',
                  width: 40,
                }}>
                <Image
                  source={require('@/assets/images/welcome-hero.png')}
                  style={{ height: '100%', width: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <AppText
                color={colors.light.primary}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 20,
                  lineHeight: 28,
                }}>
                Pemula Code
              </AppText>
            </Pressable>

            {/* Right: Bell Notification */}
            <Pressable
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {}}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: pressed
                  ? colors.light.surfaceContainerHigh
                  : colors.light.surfaceContainerLow,
                borderRadius: radius.full,
                height: 40,
                justifyContent: 'center',
                width: 40,
              })}>
              <Bell color={colors.light.primary} size={20} />
            </Pressable>
          </View>

          {/* 2. LANGUAGE SELECTOR */}
          <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing[3] }}>
              
              {/* HTML Button */}
              <Pressable
                accessibilityLabel="HTML Language"
                accessibilityRole="button"
                onPress={() => setActiveLang('html')}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor:
                    activeLang === 'html'
                      ? colors.light.secondaryFixed
                      : colors.light.surfaceContainerLow,
                  borderColor:
                    activeLang === 'html'
                      ? colors.light.secondary
                      : colors.light.outlineVariant,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: spacing[2],
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[2],
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Globe
                  color={
                    activeLang === 'html'
                      ? colors.light.secondary
                      : colors.light.onSurfaceVariant
                  }
                  size={18}
                />
                <AppText
                  color={
                    activeLang === 'html'
                      ? colors.light.secondary
                      : colors.light.onSurfaceVariant
                  }
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 14,
                    fontWeight: activeLang === 'html' ? 'bold' : '500',
                  }}>
                  HTML
                </AppText>
              </Pressable>

              {/* CSS Button */}
              <Pressable
                accessibilityLabel="CSS Language"
                accessibilityRole="button"
                onPress={() => setActiveLang('css')}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor:
                    activeLang === 'css'
                      ? colors.light.secondaryFixed
                      : colors.light.surfaceContainerLow,
                  borderColor:
                    activeLang === 'css'
                      ? colors.light.secondary
                      : colors.light.outlineVariant,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: spacing[2],
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[2],
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Palette
                  color={
                    activeLang === 'css'
                      ? colors.light.secondary
                      : colors.light.onSurfaceVariant
                  }
                  size={18}
                />
                <AppText
                  color={
                    activeLang === 'css'
                      ? colors.light.secondary
                      : colors.light.onSurfaceVariant
                  }
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 14,
                    fontWeight: activeLang === 'css' ? 'bold' : '500',
                  }}>
                  CSS
                </AppText>
              </Pressable>

              {/* JS Button */}
              <Pressable
                accessibilityLabel="JS Language"
                accessibilityRole="button"
                onPress={() => setActiveLang('js')}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor:
                    activeLang === 'js'
                      ? colors.light.secondaryFixed
                      : colors.light.surfaceContainerLow,
                  borderColor:
                    activeLang === 'js'
                      ? colors.light.secondary
                      : colors.light.outlineVariant,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: spacing[2],
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[2],
                  opacity: pressed ? 0.85 : 1,
                })}>
                <Terminal
                  color={
                    activeLang === 'js'
                      ? colors.light.secondary
                      : colors.light.onSurfaceVariant
                  }
                  size={18}
                />
                <AppText
                  color={
                    activeLang === 'js'
                      ? colors.light.secondary
                      : colors.light.onSurfaceVariant
                  }
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 14,
                    fontWeight: activeLang === 'js' ? 'bold' : '500',
                  }}>
                  JS
                </AppText>
              </Pressable>
            </ScrollView>
          </View>

          {/* 3. CODE EDITOR CARD */}
          <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
            <View
              style={{
                backgroundColor: '#1e293b',
                borderRadius: radius['2xl'],
                elevation: 8,
                overflow: 'hidden',
                shadowColor: colors.light.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
              }}>
              {/* Editor Header Toolbar */}
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#0f172a',
                  flexDirection: 'row',
                  height: 44,
                  justifyContent: 'space-between',
                  paddingHorizontal: spacing[4],
                }}>
                {/* Left: Window Dots + Filename */}
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
                  <View style={{ flexDirection: 'row', gap: spacing[1] }}>
                    <View style={{ backgroundColor: '#ef4444', borderRadius: 6, height: 10, width: 10 }} />
                    <View style={{ backgroundColor: '#f59e0b', borderRadius: 6, height: 10, width: 10 }} />
                    <View style={{ backgroundColor: '#22c55e', borderRadius: 6, height: 10, width: 10 }} />
                  </View>
                  <AppText
                    color="#94a3b8"
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                    }}>
                    {currentFilename}
                  </AppText>
                </View>

                {/* Right: Copy Button */}
                <Pressable
                  accessibilityLabel="Copy Code"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={handleCopy}
                  style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                  {isCopied ? (
                    <>
                      <Check color="#22c55e" size={16} />
                      <AppText
                        color="#22c55e"
                        style={{ fontFamily: typography.family.mono, fontSize: 11 }}>
                        Copied
                      </AppText>
                    </>
                  ) : (
                    <Copy color="#94a3b8" size={16} />
                  )}
                </Pressable>
              </View>

              {/* Editable Code Input */}
              <View style={{ padding: spacing[4] }}>
                <TextInput
                  accessibilityLabel="Code Input Editor"
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                  onChangeText={handleCodeChange}
                  style={{
                    color: '#f8fafc',
                    fontFamily: typography.family.mono,
                    fontSize: 14,
                    lineHeight: 22,
                    minHeight: 160,
                    textAlignVertical: 'top',
                  }}
                  value={currentCode}
                />
              </View>

              {/* Run Code Action Button (inside/attached to bottom of editor) */}
              <View style={{ paddingHorizontal: spacing[4], paddingBottom: spacing[4] }}>
                <Pressable
                  accessibilityLabel="Run Code"
                  accessibilityRole="button"
                  onPress={handleRunCode}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor: pressed
                      ? colors.light.primaryPressed
                      : colors.light.primary,
                    borderRadius: radius.xl,
                    flexDirection: 'row',
                    gap: spacing[2],
                    justifyContent: 'center',
                    minHeight: 52,
                    opacity: pressed ? 0.9 : 1,
                  })}>
                  <Play color="#ffffff" size={18} fill="#ffffff" />
                  <AppText
                    color="#ffffff"
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 16,
                    }}>
                    Run Code
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* 4. LIVE PREVIEW PANEL */}
          <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: colors.light.outlineVariant,
                borderRadius: radius['2xl'],
                borderWidth: 1,
                elevation: 4,
                overflow: 'hidden',
                shadowColor: colors.light.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
              }}>
              {/* Live Preview Header Toolbar */}
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.surfaceContainerLow,
                  borderColor: colors.light.outlineVariant,
                  borderBottomWidth: 1,
                  flexDirection: 'row',
                  height: 44,
                  justifyContent: 'space-between',
                  paddingHorizontal: spacing[4],
                }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                  <Eye color={colors.light.onSurfaceVariant} size={18} />
                  <AppText
                    color={colors.light.onSurfaceVariant}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                      fontWeight: 'bold',
                      letterSpacing: 0.5,
                    }}>
                    LIVE PREVIEW
                  </AppText>
                </View>

                {/* Status Indicator */}
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1] }}>
                  <View
                    style={{
                      backgroundColor: '#22c55e',
                      borderRadius: radius.full,
                      height: 8,
                      width: 8,
                    }}
                  />
                  <AppText
                    color="#22c55e"
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                    Live
                  </AppText>
                </View>
              </View>

              {/* Preview Display Body */}
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  minHeight: 140,
                  padding: spacing[6],
                }}>
                {activeLang === 'html' ? (
                  <View style={{ alignItems: 'center' }}>
                    <AppText
                      color={colors.light.text}
                      style={{
                        fontFamily: typography.family.sansBold,
                        fontSize: 22,
                        lineHeight: 30,
                        textAlign: 'center',
                      }}>
                      {parsedPreview.h1}
                    </AppText>
                    <AppText
                      color={colors.light.onSurfaceVariant}
                      style={{
                        fontSize: 15,
                        lineHeight: 22,
                        marginTop: spacing[2],
                        textAlign: 'center',
                      }}>
                      {parsedPreview.p}
                    </AppText>
                  </View>
                ) : activeLang === 'css' ? (
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        alignItems: 'center',
                        backgroundColor: colors.light.primaryFixed,
                        borderColor: colors.light.primary,
                        borderRadius: radius.xl,
                        borderWidth: 1,
                        padding: spacing[5],
                      }}>
                      <AppText
                        color={colors.light.primary}
                        style={{
                          fontFamily: typography.family.sansBold,
                          fontSize: 18,
                        }}>
                        Styled Hero Element
                      </AppText>
                      <AppText
                        color={colors.light.onSurfaceVariant}
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 13,
                          marginTop: spacing[1],
                        }}>
                        flex-col • items-center • padding: 32px
                      </AppText>
                    </View>
                  </View>
                ) : (
                  <View style={{ width: '100%' }}>
                    <View
                      style={{
                        backgroundColor: '#0f172a',
                        borderRadius: radius.lg,
                        padding: spacing[4],
                      }}>
                      <AppText
                        color="#22c55e"
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 13,
                          lineHeight: 20,
                        }}>
                        Console Output:
                      </AppText>
                      <AppText
                        color="#f8fafc"
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 13,
                          lineHeight: 20,
                          marginTop: spacing[1],
                        }}>
                        {'> "Hello, World!"'}
                      </AppText>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

        </ScrollView>
    </ScreenContainer>
  );
}
