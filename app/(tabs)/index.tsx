import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Bell,
  Brain,
  Code2,
  Flame,
  MessageCircle,
  PlayCircle,
  Search,
  Trophy,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Image,
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

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" backgroundColor={colors.light.background} />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: spacing[8],
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* Top App Bar */}
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
          {/* Left: Avatar + App Title */}
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
            <Bell color={colors.light.text} size={20} />
          </Pressable>
        </View>

        {/* Greeting + Streak Row */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing[4],
            paddingHorizontal: spacing[5],
          }}>
          {/* Left: Greeting */}
          <View style={{ flex: 1 }}>
            <AppText
              color={colors.light.onSurfaceVariant}
              style={{
                fontFamily: typography.family.mono,
                fontSize: 14,
                lineHeight: 20,
              }}>
              G'day, Alex!
            </AppText>
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 26,
                lineHeight: 34,
                marginTop: spacing[1],
              }}>
              Ready to code?
            </AppText>
          </View>

          {/* Right: Streak Card */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.secondaryFixed,
              borderColor: colors.light.secondary,
              borderRadius: radius.xl,
              borderWidth: 1,
              flexDirection: 'row',
              gap: spacing[2],
              paddingHorizontal: spacing[3],
              paddingVertical: spacing[2],
            }}>
            <Flame color={colors.light.secondary} size={22} fill={colors.light.secondary} />
            <AppText
              color={colors.light.secondary}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                lineHeight: 24,
              }}>
              12
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{ marginTop: spacing[4], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: colors.light.surfaceContainerLow,
              borderColor: isSearchFocused
                ? colors.light.primary
                : colors.light.outlineVariant,
              borderRadius: radius.xl,
              borderWidth: 1,
              flexDirection: 'row',
              gap: spacing[3],
              minHeight: 52,
              paddingHorizontal: spacing[4],
            }}>
            <Search
              color={isSearchFocused ? colors.light.primary : colors.light.outline}
              size={20}
            />
            <TextInput
              accessibilityLabel="Search lessons, languages, or help"
              onBlur={() => setIsSearchFocused(false)}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search lessons, languages, or help..."
              placeholderTextColor={colors.light.outline}
              style={{
                color: colors.light.text,
                flex: 1,
                fontFamily: typography.family.sans,
                fontSize: 15,
                minHeight: 48,
                paddingVertical: 0,
              }}
              value={searchQuery}
            />
          </View>
        </View>

        {/* Overall Mastery Card */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 6,
              padding: spacing[5],
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            }}>
            {/* Title & Percentage Header */}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 26,
                }}>
                Overall Mastery
              </AppText>
              <AppText
                color={colors.light.primary}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 18,
                  lineHeight: 26,
                }}>
                68%
              </AppText>
            </View>

            {/* Progress Bar */}
            <View
              style={{
                backgroundColor: colors.light.primaryFixed,
                borderRadius: radius.full,
                height: 12,
                marginTop: spacing[3],
                overflow: 'hidden',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: colors.light.primary,
                  borderRadius: radius.full,
                  height: '100%',
                  width: '68%',
                }}
              />
            </View>

            {/* Legend Dots */}
            <View style={{ flexDirection: 'row', gap: spacing[5], marginTop: spacing[4] }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                <View
                  style={{
                    backgroundColor: colors.light.secondary,
                    borderRadius: 4,
                    height: 8,
                    width: 8,
                  }}
                />
                <AppText
                  color={colors.light.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 13,
                    lineHeight: 18,
                  }}>
                  HTML/CSS
                </AppText>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[2] }}>
                <View
                  style={{
                    backgroundColor: colors.light.primary,
                    borderRadius: 4,
                    height: 8,
                    width: 8,
                  }}
                />
                <AppText
                  color={colors.light.onSurfaceVariant}
                  style={{
                    fontFamily: typography.family.mono,
                    fontSize: 13,
                    lineHeight: 18,
                  }}>
                  JS Core
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Challenge Card */}
        <View style={{ marginTop: spacing[5], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              backgroundColor: colors.light.primary,
              borderRadius: radius['2xl'],
              elevation: 6,
              overflow: 'hidden',
              padding: spacing[5],
              position: 'relative',
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
            }}>
            {/* Decorative Icon */}
            <View
              aria-hidden
              pointerEvents="none"
              style={{ opacity: 0.15, position: 'absolute', right: -10, top: -10 }}>
              <Brain color="#ffffff" size={110} />
            </View>

            <AppText
              color="rgba(255, 255, 255, 0.8)"
              style={{
                fontFamily: typography.family.mono,
                fontSize: 12,
                letterSpacing: 1,
              }}>
              DAILY CHALLENGE
            </AppText>

            <AppText
              color={colors.light.onPrimary}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 22,
                lineHeight: 30,
                marginTop: spacing[2],
              }}>
              Array.map() Logic
            </AppText>

            <View style={{ alignItems: 'flex-start', marginTop: spacing[4] }}>
              <Pressable
                accessibilityLabel="Solve Now"
                accessibilityRole="button"
                onPress={() => {}}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? '#f0f0ff' : '#ffffff',
                  borderRadius: radius.lg,
                  paddingHorizontal: spacing[5],
                  paddingVertical: spacing[3],
                })}>
                <AppText
                  color={colors.light.primary}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 14,
                    lineHeight: 20,
                  }}>
                  Solve Now
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Continue Learning Section */}
        <View style={{ marginTop: spacing[6], paddingHorizontal: spacing[5] }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: spacing[2],
              marginBottom: spacing[3],
            }}>
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 20,
                lineHeight: 28,
              }}>
              Continue Learning
            </AppText>
            <PlayCircle color={colors.light.primary} size={22} />
          </View>

          <Pressable
            accessibilityLabel="Continue Learning Course Card"
            accessibilityRole="button"
            onPress={() => router.push('/(tabs)/learn')}
            style={({ pressed }) => ({
              borderRadius: radius['2xl'],
              elevation: 6,
              overflow: 'hidden',
              opacity: pressed ? 0.92 : 1,
              shadowColor: colors.light.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
            })}>
            <View style={{ height: 200, position: 'relative', width: '100%' }}>
              <Image
                source={require('@/assets/images/welcome-hero.png')}
                style={{ height: '100%', width: '100%' }}
                resizeMode="cover"
              />
              {/* Dark Gradient / Contrast Overlay */}
              <View
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  bottom: 0,
                  justifyContent: 'space-between',
                  left: 0,
                  padding: spacing[5],
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}>
                <View>
                  <View style={{ alignItems: 'flex-start' }}>
                    <View
                      style={{
                        backgroundColor: colors.light.secondary,
                        borderRadius: radius.sm,
                        paddingHorizontal: spacing[2],
                        paddingVertical: spacing[1],
                      }}>
                      <AppText
                        color="#ffffff"
                        style={{
                          fontFamily: typography.family.mono,
                          fontSize: 11,
                          letterSpacing: 0.5,
                        }}>
                        JAVASCRIPT
                      </AppText>
                    </View>
                  </View>
                  <AppText
                    color="rgba(255, 255, 255, 0.85)"
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 13,
                      marginTop: spacing[2],
                    }}>
                    Module 4: Async/Await
                  </AppText>
                  <AppText
                    color="#ffffff"
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 22,
                      lineHeight: 28,
                      marginTop: spacing[1],
                    }}>
                    Mastering the Event Loop
                  </AppText>
                </View>

                {/* Progress Bar Row */}
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      borderRadius: radius.full,
                      flex: 1,
                      height: 8,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.light.secondary,
                        borderRadius: radius.full,
                        height: '100%',
                        width: '45%',
                      }}
                    />
                  </View>
                  <AppText
                    color="#ffffff"
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 14,
                    }}>
                    45%
                  </AppText>
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Shortcut Cards Horizontal Scroll */}
        <View style={{ marginTop: spacing[6], marginBottom: spacing[4] }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing[4], paddingHorizontal: spacing[5] }}>
            {/* Card 1: Community */}
            <Pressable
              accessibilityLabel="Community Shortcut"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/community')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 140,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.primaryFixed,
                  borderRadius: radius.full,
                  height: 44,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 44,
                }}>
                <MessageCircle color={colors.light.primary} size={22} />
              </View>
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  lineHeight: 22,
                }}>
                Community
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  marginTop: spacing[1],
                }}>
                24 New posts
              </AppText>
            </Pressable>

            {/* Card 2: Playground */}
            <Pressable
              accessibilityLabel="Playground Shortcut"
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/playground')}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 140,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.secondaryFixed,
                  borderRadius: radius.full,
                  height: 44,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 44,
                }}>
                <Code2 color={colors.light.secondary} size={22} />
              </View>
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  lineHeight: 22,
                }}>
                Playground
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  marginTop: spacing[1],
                }}>
                3 Drafts saved
              </AppText>
            </Pressable>

            {/* Card 3: Rankings */}
            <Pressable
              accessibilityLabel="Rankings Shortcut"
              accessibilityRole="button"
              onPress={() => {}}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? colors.light.surfaceContainer
                  : colors.light.surfaceContainerLowest,
                borderColor: colors.light.outlineVariant,
                borderRadius: radius.xl,
                borderWidth: 1,
                padding: spacing[4],
                width: 140,
              })}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.light.tertiaryFixed,
                  borderRadius: radius.full,
                  height: 44,
                  justifyContent: 'center',
                  marginBottom: spacing[3],
                  width: 44,
                }}>
                <Trophy color="#2563eb" size={22} />
              </View>
              <AppText
                color={colors.light.text}
                style={{
                  fontFamily: typography.family.sansBold,
                  fontSize: 16,
                  lineHeight: 22,
                }}>
                Rankings
              </AppText>
              <AppText
                color={colors.light.onSurfaceVariant}
                style={{
                  fontSize: 13,
                  lineHeight: 18,
                  marginTop: spacing[1],
                }}>
                #42 globally
              </AppText>
            </Pressable>
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
