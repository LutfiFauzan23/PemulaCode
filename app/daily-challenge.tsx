import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, CheckCircle2, Flame, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import {
  getChallengeDateKey,
  getDailyChallenge,
  type DailyChallenge,
} from '@/constants/daily-challenges';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useStreak } from '@/hooks/use-streak';
import { recordActivity as syncActivityToServer } from '@/services/progressService';
import { useTranslation } from '@/translations';

const STORAGE_PREFIX = 'daily_challenge_completed_';

type SavedAnswer = { selected: number; correct: boolean };

/** Warna status benar/salah yang tetap terbaca di mode terang maupun gelap. */
function statusColors(mode: 'light' | 'dark') {
  if (mode === 'dark') {
    return {
      correct: { bg: '#143627', border: '#22c55e', text: '#4ade80' },
      wrong: { bg: '#3b1d1d', border: '#ef4444', text: '#f87171' },
    };
  }
  return {
    correct: { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
    wrong: { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c' },
  };
}

export default function DailyChallengeScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t, language } = useTranslation();
  // Menjawab tantangan harian juga dihitung sebagai "menyelesaikan soal hari ini".
  const { recordActivity } = useStreak();
  const [challenge] = useState<DailyChallenge>(() => getDailyChallenge());
  const [selected, setSelected] = useState<number | null>(null);
  const [savedAnswer, setSavedAnswer] = useState<SavedAnswer | null>(null);
  const dateKey = getChallengeDateKey();
  const completed = savedAnswer !== null;
  const status = statusColors(mode);
  const dateLabel = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'id-ID', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(new Date());

  // Jawaban hari ini tersimpan di AsyncStorage supaya tidak bisa diulang.
  useEffect(() => {
    AsyncStorage.getItem(`${STORAGE_PREFIX}${dateKey}`).then((value) => {
      if (value) setSavedAnswer(JSON.parse(value) as SavedAnswer);
    });
  }, [dateKey]);

  const submitAnswer = async () => {
    if (selected === null || completed) return;
    const correct = selected === challenge.answer;
    const answer = { selected, correct };
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${dateKey}`, JSON.stringify(answer));
    setSavedAnswer(answer);
    const streakCount = recordActivity();
    void syncActivityToServer(correct ? 50 : 10, streakCount);
  };

  return (
    <ScreenContainer padded={false} style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: spacing[5],
          paddingTop: spacing[2],
        }}
        showsVerticalScrollIndicator={false}>
        {/* Top App Bar — pola sama dengan layar kuis */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            height: 60,
            paddingHorizontal: 0,
          }}>
          <Pressable
            accessibilityLabel={t('back')}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: pressed
                ? c.surfaceContainerHigh
                : c.surfaceContainerLow,
              borderRadius: radius.full,
              height: 40,
              justifyContent: 'center',
              width: 40,
            })}>
            <ArrowLeft color={c.text} size={20} />
          </Pressable>
        </View>

        {/* Judul + tanggal + badge streak */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ flex: 1 }}>
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 24,
                lineHeight: 32,
              }}>
              {t('todayChallenge')}
            </AppText>
            <AppText
              color={c.onSurfaceVariant}
              style={{ marginTop: spacing[1], fontSize: 14 }}>
              {dateLabel}
            </AppText>
          </View>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: c.secondaryFixed,
              borderRadius: radius.xl,
              flexDirection: 'row',
              gap: spacing[1],
              padding: spacing[2],
            }}>
            <Flame color={c.secondary} size={16} fill={c.secondary} />
            <AppText color={c.secondary} style={{ fontSize: 12 }}>
              {t('resetsTomorrow')}
            </AppText>
          </View>
        </View>

        {/* Progress hari ini */}
        <View
          style={{
            backgroundColor: c.primaryFixed,
            borderRadius: radius.full,
            height: 8,
            marginTop: spacing[5],
            overflow: 'hidden',
          }}>
          <View
            style={{
              backgroundColor: c.primary,
              borderRadius: radius.full,
              height: '100%',
              width: completed ? '100%' : '50%',
            }}
          />
        </View>

        {/* Kartu soal */}
        <View
          style={{
            backgroundColor: c.surfaceContainerLowest,
            borderColor: c.outlineVariant,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            marginTop: spacing[6],
            padding: spacing[5],
          }}>
          <AppText
            color={c.primary}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            {challenge.topic} • {t('oneDailyQuestion')}
          </AppText>
          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 20,
              lineHeight: 28,
              marginTop: spacing[3],
            }}>
            {challenge.question}
          </AppText>

          {/* Opsi jawaban */}
          <View style={{ gap: spacing[3], marginTop: spacing[5] }}>
            {challenge.options.map((option, index) => {
              const isCorrect = completed && index === challenge.answer;
              const isWrong =
                completed && index === savedAnswer?.selected && !isCorrect;
              const isSelected = selected === index;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  disabled={completed}
                  onPress={() => setSelected(index)}
                  style={{
                    alignItems: 'center',
                    backgroundColor: isCorrect
                      ? status.correct.bg
                      : isWrong
                        ? status.wrong.bg
                        : isSelected
                          ? c.primaryFixed
                          : c.surfaceContainerLow,
                    borderColor: isCorrect
                      ? status.correct.border
                      : isWrong
                        ? status.wrong.border
                        : isSelected
                          ? c.primary
                          : c.outlineVariant,
                    borderRadius: radius.lg,
                    borderWidth: 1.5,
                    flexDirection: 'row',
                    padding: spacing[4],
                  }}>
                  <AppText
                    color={
                      isCorrect
                        ? status.correct.text
                        : isWrong
                          ? status.wrong.text
                          : c.text
                    }
                    style={{ flex: 1, fontSize: 15 }}>
                    {String.fromCharCode(65 + index)}. {option}
                  </AppText>
                  {isCorrect ? (
                    <CheckCircle2 color={status.correct.border} size={19} />
                  ) : null}
                  {isWrong ? <XCircle color={status.wrong.border} size={19} /> : null}
                </Pressable>
              );
            })}
          </View>

          {/* Pembahasan setelah menjawab */}
          {completed ? (
            <View
              style={{
                backgroundColor: savedAnswer?.correct
                  ? status.correct.bg
                  : status.wrong.bg,
                borderRadius: radius.lg,
                marginTop: spacing[5],
                padding: spacing[4],
              }}>
              <AppText
                color={savedAnswer?.correct ? status.correct.text : status.wrong.text}
                style={{ fontFamily: typography.family.sansBold }}>
                {savedAnswer?.correct ? t('answerCorrect') : t('answerWrong')}
              </AppText>
              <AppText
                color={c.text}
                style={{ fontSize: 13, lineHeight: 19, marginTop: spacing[1] }}>
                {challenge.explanation}
              </AppText>
              <AppText
                color={c.primary}
                style={{
                  fontFamily: typography.family.sansBold,
                  marginTop: spacing[3],
                }}>
                {savedAnswer?.correct ? '+50 XP' : t('xpForTrying')}
              </AppText>
            </View>
          ) : (
            <Pressable
              accessibilityLabel={t('submitQuiz')}
              accessibilityRole="button"
              disabled={selected === null}
              onPress={() => void submitAnswer()}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor:
                  selected === null ? c.disabled : pressed ? c.primaryPressed : c.primary,
                borderRadius: radius.xl,
                marginTop: spacing[6],
                paddingVertical: spacing[4],
              })}>
              <AppText
                color="#ffffff"
                style={{ fontFamily: typography.family.sansBold }}>
                {t('submitQuiz')}
              </AppText>
            </Pressable>
          )}
        </View>

        {/* Penutup saat tantangan selesai */}
        {completed ? (
          <View style={{ alignItems: 'center', paddingTop: spacing[6] }}>
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                textAlign: 'center',
              }}>
              {t('dailyDone')}
            </AppText>
            <AppText
              color={c.onSurfaceVariant}
              style={{ marginTop: spacing[2], textAlign: 'center' }}>
              {t('comeBackTomorrow')}
            </AppText>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
