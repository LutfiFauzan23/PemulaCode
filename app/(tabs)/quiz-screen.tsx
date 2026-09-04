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
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

import cssQuizData from '@/data/quizzes/css.json';
import htmlQuizData from '@/data/quizzes/html.json';
import jsQuizData from '@/data/quizzes/javascript.json';
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

export default function QuizScreen() {
  const router = useRouter();
  const { courseId, moduleId } = useLocalSearchParams<{
    courseId?: string;
    moduleId?: string;
  }>();

  const completeQuiz = useProgressStore((state) => state.completeQuiz);

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
        accentFixed: '#cfe5ff',
        accentPressed: '#004c7d',
      };
    }
    if (normalizedCourseId === 'javascript' || normalizedCourseId === 'js') {
      return {
        accent: colors.light.primary,
        accentFixed: colors.light.primaryFixed,
        accentPressed: colors.light.primaryPressed,
      };
    }
    return {
      accent: colors.light.secondary,
      accentFixed: colors.light.secondaryFixed,
      accentPressed: colors.light.secondaryPressed,
    };
  }, [normalizedCourseId]);

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

    // 1. Direct match
    if (sourceMap[rawModuleId]) return sourceMap[rawModuleId];

    // 2. Normalized key match (e.g. html-02)
    if (sourceMap[resolvedQuizKey]) return sourceMap[resolvedQuizKey];

    // 3. Fallback alias (e.g. html-module-1 -> html-01)
    const normalizedKey = rawModuleId.replace('module-', '0');
    if (sourceMap[normalizedKey]) return sourceMap[normalizedKey];

    // 4. Default to first quiz in map
    const firstKey = Object.keys(sourceMap)[0];
    return sourceMap[firstKey] || null;
  }, [normalizedCourseId, rawModuleId, resolvedQuizKey]);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(5).fill(null),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset quiz state whenever course or module changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(quizData?.questions.length || 5).fill(null));
    setIsSubmitted(false);
  }, [normalizedCourseId, rawModuleId, quizData?.moduleId]);

  const questions = quizData?.questions || [];
  const totalQuestions = questions.length || 5;
  const currentQuestion = questions[currentQuestionIndex];
  const currentSelection = selectedAnswers[currentQuestionIndex];

  // Calculate score
  const correctCount = useMemo(() => {
    if (!questions.length) return 0;
    return selectedAnswers.reduce((acc: number, selected, idx) => {
      if (selected !== null && selected === questions[idx]?.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [selectedAnswers, questions]);

  const isPassed = correctCount >= 4;

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNextOrSubmit = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Final question submitted
      setIsSubmitted(true);
      if (correctCount >= 4 && quizData) {
        completeQuiz(quizData.courseId, quizData.moduleId);
      }
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(totalQuestions).fill(null));
    setIsSubmitted(false);
  };

  const handleBackPress = () => {
    if (!isSubmitted && selectedAnswers.some((ans) => ans !== null)) {
      Alert.alert(
        'Exit Quiz?',
        'Your answers will not be saved. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => router.back() },
        ],
      );
    } else {
      router.back();
    }
  };

  if (!quizData || !currentQuestion) {
    return (
      <ScreenContainer style={{ backgroundColor: colors.light.background }}>
        <AppText color={colors.light.text}>Quiz content not found.</AppText>
      </ScreenContainer>
    );
  }

  // ════════════════════════════════════════════════════
  // 1. RESULT VIEW (AFTER QUIZ SUBMISSION)
  // ════════════════════════════════════════════════════
  if (isSubmitted) {
    return (
      <ScreenContainer
        padded={false}
        style={{ backgroundColor: colors.light.background }}>
        <StatusBar style="dark" />

        {/* Top Bar */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.light.background,
            flexDirection: 'row',
            height: 60,
            paddingHorizontal: spacing[5],
            paddingTop: spacing[2],
          }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
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
            <ArrowLeft color={colors.light.text} size={20} />
          </Pressable>

          <AppText
            color={colors.light.text}
            style={{
              fontFamily: typography.family.sansBold,
              fontSize: 18,
              marginLeft: spacing[4],
            }}>
            Quiz Results
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
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: colors.light.outlineVariant,
              borderRadius: radius['2xl'],
              borderWidth: 1,
              elevation: 6,
              padding: spacing[6],
              shadowColor: isPassed ? theme.accent : colors.light.error,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              width: '100%',
            }}>
            {/* Icon Header */}
            <View
              style={{
                alignItems: 'center',
                backgroundColor: isPassed ? theme.accentFixed : '#ffebe9',
                borderRadius: radius.full,
                height: 80,
                justifyContent: 'center',
                marginBottom: spacing[4],
                width: 80,
              }}>
              {isPassed ? (
                <Trophy color={theme.accent} size={40} />
              ) : (
                <AlertCircle color={colors.light.error} size={40} />
              )}
            </View>

            {/* Title */}
            <AppText
              color={colors.light.text}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 24,
                textAlign: 'center',
              }}>
              {isPassed ? 'Quiz Passed!' : 'Quiz Not Passed'}
            </AppText>

            {/* Score */}
            <AppText
              color={isPassed ? theme.accent : colors.light.error}
              style={{
                fontFamily: typography.family.sansBold,
                fontSize: 32,
                marginTop: spacing[2],
              }}>
              {correctCount} / {totalQuestions}
            </AppText>

            {/* Subtext */}
            <AppText
              color={colors.light.onSurfaceVariant}
              style={{
                fontSize: 14,
                lineHeight: 21,
                marginTop: spacing[2],
                textAlign: 'center',
              }}>
              {isPassed
                ? 'Great job! You have successfully completed this quiz and unlocked the next step.'
                : 'Review the lesson and try again. You need at least 4 out of 5 to pass.'}
            </AppText>

            {/* Action Buttons */}
            {isPassed ? (
              <Pressable
                accessibilityLabel="Continue to Course"
                accessibilityRole="button"
                onPress={() => {
                  if (quizData.courseId === 'html') {
                    router.replace('/(tabs)/html-course');
                  } else if (quizData.courseId === 'css') {
                    router.replace('/(tabs)/css-course');
                  } else {
                    router.replace(`/(tabs)/course-detail?courseId=${quizData.courseId}`);
                  }
                }}
                style={({ pressed }) => ({
                  alignItems: 'center',
                  backgroundColor: pressed ? theme.accentPressed : theme.accent,
                  borderRadius: radius.xl,
                  justifyContent: 'center',
                  marginTop: spacing[6],
                  minHeight: 50,
                  opacity: pressed ? 0.9 : 1,
                  width: '100%',
                })}>
                <AppText
                  color="#ffffff"
                  style={{
                    fontFamily: typography.family.sansBold,
                    fontSize: 16,
                  }}>
                  Continue
                </AppText>
              </Pressable>
            ) : (
              <View style={{ gap: spacing[3], marginTop: spacing[6], width: '100%' }}>
                <Pressable
                  accessibilityLabel="Try Again"
                  accessibilityRole="button"
                  onPress={handleTryAgain}
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor: pressed ? theme.accentPressed : theme.accent,
                    borderRadius: radius.xl,
                    flexDirection: 'row',
                    gap: spacing[2],
                    justifyContent: 'center',
                    minHeight: 48,
                    opacity: pressed ? 0.9 : 1,
                    width: '100%',
                  })}>
                  <RotateCcw color="#ffffff" size={18} />
                  <AppText
                    color="#ffffff"
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 15,
                    }}>
                    Try Again
                  </AppText>
                </Pressable>

                <Pressable
                  accessibilityLabel="Review Lesson"
                  accessibilityRole="button"
                  onPress={() =>
                    router.replace(
                      `/(tabs)/lesson-detail?courseId=${quizData.courseId}&moduleId=${quizData.moduleId}`,
                    )
                  }
                  style={({ pressed }) => ({
                    alignItems: 'center',
                    backgroundColor: pressed
                      ? colors.light.surfaceContainerHigh
                      : colors.light.surfaceContainerLow,
                    borderColor: colors.light.outlineVariant,
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    justifyContent: 'center',
                    minHeight: 48,
                    width: '100%',
                  })}>
                  <AppText
                    color={colors.light.text}
                    style={{
                      fontFamily: typography.family.sansBold,
                      fontSize: 15,
                    }}>
                    Review Lesson
                  </AppText>
                </Pressable>
              </View>
            )}
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
      style={{ backgroundColor: colors.light.background }}>
      <StatusBar style="dark" />

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
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[3] }}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleBackPress}
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
            <ArrowLeft color={colors.light.text} size={20} />
          </Pressable>

          <View>
            <AppText
              color={colors.light.text}
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
            color={colors.light.onSurfaceVariant}
            style={{
              fontFamily: typography.family.mono,
              fontSize: 13,
            }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: colors.light.outlineVariant,
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
            QUESTION {currentQuestionIndex + 1}
          </AppText>

          <AppText
            color={colors.light.text}
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
                    ? colors.light.surfaceContainerHigh
                    : 'rgba(255, 255, 255, 0.95)',
                  borderColor: isSelected
                    ? theme.accent
                    : colors.light.outlineVariant,
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
                      : colors.light.surfaceContainerLow,
                    borderRadius: radius.lg,
                    height: 34,
                    justifyContent: 'center',
                    width: 34,
                  }}>
                  <AppText
                    color={isSelected ? '#ffffff' : colors.light.text}
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
                  color={colors.light.text}
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
          backgroundColor: '#ffffff',
          borderTopColor: colors.light.outlineVariant,
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
              ? 'Submit Quiz'
              : 'Next Question'
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
                : colors.light.outlineVariant,
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
              ? 'Submit Quiz'
              : 'Next Question'}
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
