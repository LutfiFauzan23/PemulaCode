import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/translations';

import cssQuizData from '@/data/quizzes/css.json';
import htmlQuizData from '@/data/quizzes/html.json';
import jsQuizData from '@/data/quizzes/javascript.json';
import { useStreak } from '@/hooks/use-streak';
import { recordActivity as syncActivityToServer } from '@/services/progressService';
import { useProgressStore } from '@/stores/progress-store';

type QuestionItem = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

type QuizData = {
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  questions: QuestionItem[];
};

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

/** Layar cadangan saat paket soal tidak ditemukan — dipakai dua guard. */
function QuizNotFound() {
  const { colors: c } = useTheme();
  const { t } = useTranslation();
  return (
    <ScreenContainer style={{ backgroundColor: c.background }}>
      <AppText color={c.text}>{t('quizNotFound')}</AppText>
    </ScreenContainer>
  );
}

export default function QuizScreen() {
  const router = useRouter();
  const { colors: c, mode } = useTheme();
  const { t } = useTranslation();
  const { courseId, moduleId } = useLocalSearchParams<{
    courseId?: string;
    moduleId?: string;
  }>();

  const completeQuiz = useProgressStore((state) => state.completeQuiz);
  // Streak per akun: +1 untuk hari ini saat kuis diselesaikan.
  const { recordActivity } = useStreak();

  // Normalize courseId and moduleId
  const normalizedCourseId = (courseId || 'html').toLowerCase();
  const rawModuleId = (moduleId || 'html-01').toLowerCase();

  // Helper to normalize module key lookup (e.g. html-module-2, html-2, 2 -> html-02)
  const resolvedQuizKey = useMemo(() => {
    const course = normalizedCourseId === 'js' ? 'javascript' : normalizedCourseId;
    let numStr = rawModuleId.replace(/[^0-9]/g, '');
    if (!numStr) numStr = '1';
    const padded = numStr.padStart(2, '0');
    return `${course === 'javascript' ? 'javascript' : course}-${padded}`;
  }, [normalizedCourseId, rawModuleId]);

  // Color theme mapping
  const theme = useMemo(() => {
    if (normalizedCourseId === 'css') {
      return {
        accent: '#00629d',
        accentFixed: mode === 'dark' ? '#16324d' : '#cfe5ff',
        accentPressed: '#004c7d',
      };
    }
    if (normalizedCourseId === 'javascript' || normalizedCourseId === 'js') {
      return {
        accent: c.primary,
        accentFixed: c.primaryFixed,
        accentPressed: c.primaryPressed,
      };
    }
    return {
      accent: c.secondary,
      accentFixed: c.secondaryFixed,
      accentPressed: c.secondaryPressed,
    };
  }, [normalizedCourseId, c, mode]);

  // Load target quiz data
  const quizData: QuizData | null = useMemo(() => {
    let sourceMap: Record<string, QuizData> | null = null;
    if (normalizedCourseId === 'html') {
      sourceMap = htmlQuizData.quizzes as Record<string, QuizData>;
    } else if (normalizedCourseId === 'css') {
      sourceMap = cssQuizData.quizzes as Record<string, QuizData>;
    } else if (normalizedCourseId === 'javascript' || normalizedCourseId === 'js') {
      sourceMap = jsQuizData.quizzes as Record<string, QuizData>;
    }

    if (!sourceMap) return null;
    return sourceMap[resolvedQuizKey] || sourceMap[`${normalizedCourseId}-01`] || null;
  }, [normalizedCourseId, resolvedQuizKey]);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [currentSelection, setCurrentSelection] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);

  // Reset jawaban setiap kali paket soal berganti. Dilakukan saat render
  // (pola resmi React "menyesuaikan state ketika data berubah") sehingga tidak
  // memicu render berantai seperti `setState` di dalam `useEffect`.
  const [loadedQuizKey, setLoadedQuizKey] = useState<string | null>(null);
  const quizKey = quizData ? `${quizData.courseId}:${quizData.moduleId}` : null;

  if (quizKey !== loadedQuizKey) {
    setLoadedQuizKey(quizKey);
    setUserAnswers(quizData ? new Array(quizData.questions.length).fill(null) : []);
    setCurrentQuestionIndex(0);
    setCurrentSelection(null);
    setIsSubmitted(false);
    setFinalScore(0);
    setEarnedXP(0);
  }

  if (!quizData) {
    return <QuizNotFound />;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setCurrentSelection(index);
  };

  const handleNextOrSubmit = () => {
    if (currentSelection === null) return;

    // Save current selection
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = currentSelection;
    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      // Go to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentSelection(updatedAnswers[nextIndex]);
    } else {
      // Calculate results and submit
      let correctCount = 0;
      quizData.questions.forEach((q, idx) => {
        if (updatedAnswers[idx] === q.correctAnswer) {
          correctCount += 1;
        }
      });

      const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
      const isPassed = scorePercentage >= 70;
      const xpGained = correctCount * 15 + (isPassed ? 25 : 0);

      setFinalScore(correctCount);
      setEarnedXP(xpGained);
      setIsSubmitted(true);

      // Persist progress to store
      completeQuiz(normalizedCourseId, resolvedQuizKey);
      // Selesaikan soal hari ini → streak hari ini bertambah, lalu XP
      // disimpan ke server supaya leaderboard memakai data asli.
      const streakCount = recordActivity();
      void syncActivityToServer(xpGained, streakCount);
    }
  };

  const handleRetryQuiz = () => {
    setUserAnswers(new Array(totalQuestions).fill(null));
    setCurrentQuestionIndex(0);
    setCurrentSelection(null);
    setIsSubmitted(false);
    setFinalScore(0);
    setEarnedXP(0);
  };

  const handleBackPress = () => {
    if (isSubmitted) {
      router.replace('/(tabs)/learn');
      return;
    }

    if (currentQuestionIndex > 0) {
      Alert.alert(t('exitQuiz'), t('exitQuizMessage'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('exit'), style: 'destructive', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  if (!quizData || !currentQuestion) {
    return <QuizNotFound />;
  }

  // ════════════════════════════════════════════════════
  // 1. RESULT VIEW (AFTER QUIZ SUBMISSION)
  // ════════════════════════════════════════════════════
  if (isSubmitted) {
    const isPassed = Math.round((finalScore / totalQuestions) * 100) >= 70;

    return (
      <ScreenContainer
        padded={false}
        style={{ backgroundColor: c.background }}>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

        {/* Top Bar */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: c.background,
            flexDirection: 'row',
            height: 60,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[2],
          }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.replace('/(tabs)/learn')}
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

          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 18,
              marginLeft: spacing[4],
            }}>
            {t('quizResults')}
          </AppText>
        </View>

        {/* Results Card */}
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: spacing[6],
          }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: c.surfaceContainerLowest,
              borderColor: c.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 6,
              padding: spacing[6],
              shadowColor: isPassed ? theme.accent : c.danger,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              width: '100%',
            }}>
            {/* Header Icon */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: isPassed ? theme.accentFixed : (mode === 'dark' ? '#5c1d1d' : '#ffdad6'),
                borderRadius: radius.full,
                height: 80,
                justifyContent: 'center',
                marginBottom: spacing[4],
                width: 80,
              }}>
              {isPassed ? (
                <Trophy color={theme.accent} size={40} />
              ) : (
                <AlertCircle color={c.danger} size={40} />
              )}
            </View>

            {/* Title */}
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 24,
                lineHeight: 32,
                textAlign: 'center',
              }}>
              {isPassed ? t('quizComplete') : t('quizNotPassed')}
            </AppText>

            {/* Score */}
            <AppText
              color={isPassed ? theme.accent : c.danger}
              style={{
                fontFamily: typography.family.mono,
                fontSize: 42,
                fontWeight: 'bold',
                marginTop: spacing[2],
              }}>
              {finalScore}/{totalQuestions}
            </AppText>

            <AppText
              color={c.onSurfaceVariant}
              style={{
                fontSize: 15,
                lineHeight: 22,
                marginTop: spacing[2],
                textAlign: 'center',
              }}>
              {isPassed ? t('greatJob') : t('needMore')}
            </AppText>

            {/* XP Gained Badge */}
            {isPassed && (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: theme.accentFixed,
                  borderRadius: radius.xl,
                  flexDirection: 'row',
                  gap: spacing[2],
                  marginTop: spacing[4],
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[2],
                }}>
                <Sparkles color={theme.accent} size={18} />
                <AppText
                  color={theme.accent}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 15,
                  }}>
                  {t('xpEarned', { xp: earnedXP })}
                </AppText>
              </View>
            )}

            {/* Actions */}
            <View style={{ gap: spacing[3], marginTop: spacing[6], width: '100%' }}>
              <Pressable
                accessibilityLabel="Continue to Learn Hub"
                accessibilityRole="button"
                onPress={() => router.replace('/(tabs)/learn')}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: pressed ? theme.accentPressed : theme.accent,
                  borderRadius: radius.xl,
                  flexDirection: 'row',
                  gap: spacing[2],
                  height: 52,
                  justifyContent: 'center',
                  width: '100%',
                })}>
                <AppText
                  color="#ffffff"
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 16,
                  }}>
                  {t('continue')}
                </AppText>
                <ChevronRight color="#ffffff" size={20} />
              </Pressable>

              <Pressable
                accessibilityLabel="Retry Quiz"
                accessibilityRole="button"
                onPress={handleRetryQuiz}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: pressed
                    ? c.surfaceContainerHigh
                    : c.surfaceContainerLow,
                  borderColor: c.outlineVariant,
                  borderRadius: radius.xl,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: spacing[2],
                  height: 52,
                  justifyContent: 'center',
                  width: '100%',
                })}>
                <RotateCcw color={c.text} size={18} />
                <AppText
                  color={c.text}
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 16,
                  }}>
                  {t('tryAgain')}
                </AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // ════════════════════════════════════════════════════
  // 2. ACTIVE QUIZ QUESTION VIEW
  // ════════════════════════════════════════════════════
  return (
    <ScreenContainer
      padded={false}
      style={{ backgroundColor: c.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      {/* Top App Bar */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: c.background,
          flexDirection: 'row',
          height: 60,
          justifyContent: 'space-between',
          paddingHorizontal: spacing[5],
          paddingTop: spacing[2],
        }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleBackPress}
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

          <View>
            <AppText
              color={c.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 18,
                lineHeight: 24,
              }}>
              {quizData.title}
            </AppText>
          </View>
        </View>

        {/* Badge */}
        <View
          style={{
            backgroundColor: theme.accentFixed,
            borderRadius: radius.full,
            paddingHorizontal: spacing[3],
            paddingVertical: spacing[1],
          }}>
          <AppText
            color={theme.accent}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            {quizData.courseId.toUpperCase()}
          </AppText>
        </View>
      </View>

      {/* Progress Bar & Counter */}
      <View style={{ paddingHorizontal: spacing[5], paddingTop: spacing[2] }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: spacing[2],
          }}>
          <AppText
            color={c.onSurfaceVariant}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
            }}>
            {t('questionIndicator', {
              current: currentQuestionIndex + 1,
              total: totalQuestions,
            })}
          </AppText>
          <AppText
            color={theme.accent}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
              fontWeight: 'bold',
            }}>
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </AppText>
        </View>

        {/* Progress Bar Track */}
        <View
          style={{
            backgroundColor: theme.accentFixed,
            borderRadius: radius.full,
            height: 8,
            overflow: 'hidden',
            width: '100%',
          }}>
          <View
            style={{
              backgroundColor: theme.accent,
              borderRadius: radius.full,
              height: '100%',
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Main Question & Options ScrollView */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing[5],
          paddingTop: spacing[5],
          paddingBottom: 90,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Question Box */}
        <View
          style={{
            backgroundColor: c.surfaceContainerLowest,
            borderColor: c.outlineVariant,
            borderRadius: radius['2xl'],
            borderWidth: 1,
            elevation: 2,
            marginBottom: spacing[5],
            padding: spacing[5],
          }}>
          <AppText
            color={theme.accent}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 12,
              fontWeight: 'bold',
              marginBottom: spacing[2],
            }}>
            {t('question').toUpperCase()} {currentQuestionIndex + 1}
          </AppText>

          <AppText
            color={c.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 18,
              lineHeight: 26,
            }}>
            {currentQuestion.question}
          </AppText>
        </View>

        {/* 5 Answer Option Cards */}
        <View style={{ gap: spacing[3] }}>
          {currentQuestion.options.map((optionText, optIdx) => {
            const isSelected = currentSelection === optIdx;
            const optionLabel = OPTION_LABELS[optIdx] || `${optIdx + 1}`;

            return (
              <Pressable
                key={optIdx}
                accessibilityLabel={`Option ${optionLabel}: ${optionText}`}
                accessibilityRole="button"
                onPress={() => handleSelectOption(optIdx)}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: isSelected
                    ? theme.accentFixed
                    : pressed
                    ? c.surfaceContainerHigh
                    : c.surfaceContainerLowest,
                  borderColor: isSelected
                    ? theme.accent
                    : c.outlineVariant,
                  borderWidth: isSelected ? 2 : 1,
                  borderRadius: radius.xl,
                  flexDirection: 'row',
                  gap: spacing[3],
                  minHeight: 56,
                  paddingHorizontal: spacing[4],
                  paddingVertical: spacing[3],
                })}>
                {/* Option Badge (A, B, C, D, E) */}
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: isSelected
                      ? theme.accent
                      : c.surfaceContainerLow,
                    borderRadius: radius.lg,
                    height: 34,
                    justifyContent: 'center',
                    width: 34,
                  }}>
                  <AppText
                    color={isSelected ? '#ffffff' : c.text}
                    style={{
                      fontFamily: typography.family.mono,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}>
                    {optionLabel}
                  </AppText>
                </View>

                {/* Option Text */}
                <AppText
                  color={c.text}
                  style={{
                    flex: 1,
                    fontFamily: isSelected
                      ? typography.family.sansBold
                      : typography.family.sans,
                    fontSize: 15,
                    lineHeight: 21,
                  }}>
                  {optionText}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Button */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: c.background,
          borderTopColor: c.outlineVariant,
          borderTopWidth: 1,
          bottom: 0,
          elevation: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          left: 0,
          paddingHorizontal: spacing[5],
          paddingVertical: spacing[3],
          position: 'absolute',
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        }}>
        <View style={{ flex: 1 }} />

        <Pressable
          accessibilityLabel={
            currentQuestionIndex === totalQuestions - 1
              ? t('submitQuiz')
              : t('next')
          }
          accessibilityRole="button"
          disabled={currentSelection === null}
          onPress={handleNextOrSubmit}
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor:
              currentSelection !== null
                ? pressed
                  ? theme.accentPressed
                  : theme.accent
                : c.outlineVariant,
            borderRadius: radius.xl,
            flexDirection: 'row',
            gap: spacing[2],
            height: 48,
            justifyContent: 'center',
            opacity: currentSelection !== null ? (pressed ? 0.9 : 1) : 0.5,
            paddingHorizontal: spacing[6],
          })}>
          <AppText
            color="#ffffff"
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 15,
            }}>
            {currentQuestionIndex === totalQuestions - 1
              ? t('submitQuiz')
              : t('next')}
          </AppText>
          {currentQuestionIndex === totalQuestions - 1 ? (
            <CheckCircle2 color="#ffffff" size={18} />
          ) : (
            <ChevronRight color="#ffffff" size={18} />
          )}
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
