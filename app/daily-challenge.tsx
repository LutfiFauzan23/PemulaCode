import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, Flame, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { getChallengeDateKey, getDailyChallenge, type DailyChallenge } from '@/constants/daily-challenges';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useTheme } from '@/context/ThemeContext';

const STORAGE_PREFIX = 'daily_challenge_completed_';
type SavedAnswer = { selected: number; correct: boolean };

export default function DailyChallengeScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const [challenge] = useState<DailyChallenge>(() => getDailyChallenge());
  const [selected, setSelected] = useState<number | null>(null);
  const [savedAnswer, setSavedAnswer] = useState<SavedAnswer | null>(null);
  const dateKey = getChallengeDateKey();
  const completed = savedAnswer !== null;
  const dateLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  useEffect(() => { AsyncStorage.getItem(`${STORAGE_PREFIX}${dateKey}`).then((value) => { if (value) setSavedAnswer(JSON.parse(value) as SavedAnswer); }); }, [dateKey]);
  const submitAnswer = async () => { if (selected === null || completed) return; const answer = { selected, correct: selected === challenge.answer }; await AsyncStorage.setItem(`${STORAGE_PREFIX}${dateKey}`, JSON.stringify(answer)); setSavedAnswer(answer); };

  return <ScreenContainer padded={false} style={{ backgroundColor: c.background }}><ScrollView contentContainerStyle={{ padding: spacing[5], paddingBottom: 110 }}><Pressable accessibilityRole="button" onPress={() => router.back()} style={{ alignItems: 'center', flexDirection: 'row', gap: spacing[1], marginBottom: spacing[5] }}><ArrowLeft color={c.primary} size={18} /><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold }}>Home</AppText></Pressable><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><View style={{ flex: 1 }}><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 25 }}>Tantangan Hari Ini</AppText><AppText color={c.onSurfaceVariant} style={{ marginTop: spacing[1] }}>{dateLabel}</AppText></View><View style={{ alignItems: 'center', backgroundColor: c.secondaryFixed, borderRadius: radius.xl, flexDirection: 'row', gap: spacing[1], padding: spacing[2] }}><Flame color={c.secondary} size={17} /><AppText color={c.secondary} style={{ fontSize: 12 }}>Reset besok</AppText></View></View><View style={{ backgroundColor: c.primaryFixed, borderRadius: radius.full, height: 9, marginTop: spacing[5], overflow: 'hidden' }}><View style={{ backgroundColor: c.primary, borderRadius: radius.full, height: '100%', width: completed ? '100%' : '50%' }} /></View><View style={{ backgroundColor: c.surfaceContainerLowest, borderColor: c.outlineVariant, borderRadius: radius['2xl'], borderWidth: 1, marginTop: spacing[6], padding: spacing[5] }}><AppText color={c.primary} style={{ fontFamily: typography.family.mono, fontSize: 12, fontWeight: 'bold' }}>{challenge.topic} â€¢ 1 SOAL HARIAN</AppText><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 20, lineHeight: 28, marginTop: spacing[3] }}>{challenge.question}</AppText><View style={{ gap: spacing[3], marginTop: spacing[5] }}>{challenge.options.map((option, index) => { const correct = completed && index === challenge.answer; const wrong = completed && index === savedAnswer?.selected && !correct; return <Pressable key={option} disabled={completed} onPress={() => setSelected(index)} style={{ alignItems: 'center', backgroundColor: correct ? '#dcfce7' : wrong ? '#fee2e2' : selected === index ? c.primaryFixed : c.surfaceContainerLow, borderColor: correct ? '#16a34a' : wrong ? '#dc2626' : selected === index ? c.primary : c.outlineVariant, borderRadius: radius.lg, borderWidth: 1.5, flexDirection: 'row', padding: spacing[4] }}><AppText color={correct ? '#15803d' : wrong ? '#b91c1c' : c.text} style={{ flex: 1, fontSize: 15 }}>{String.fromCharCode(65 + index)}. {option}</AppText>{correct && <CheckCircle2 color="#16a34a" size={19} />}{wrong && <XCircle color="#dc2626" size={19} />}</Pressable>; })}</View>{completed && <View style={{ backgroundColor: savedAnswer?.correct ? '#f0fdf4' : '#fef2f2', borderRadius: radius.lg, marginTop: spacing[5], padding: spacing[4] }}><AppText color={savedAnswer?.correct ? '#15803d' : '#b91c1c'} style={{ fontFamily: typography.family.sansBold }}>{savedAnswer?.correct ? 'Jawaban Benar!' : 'Jawaban Salah'}</AppText><AppText color={c.text} style={{ fontSize: 13, lineHeight: 19, marginTop: spacing[1] }}>{challenge.explanation}</AppText><AppText color={c.primary} style={{ fontFamily: typography.family.sansBold, marginTop: spacing[3] }}>{savedAnswer?.correct ? '+50 XP' : '+10 XP untuk mencoba'}</AppText></View>}{!completed && <Pressable disabled={selected === null} onPress={submitAnswer} style={{ alignItems: 'center', backgroundColor: selected === null ? c.disabled : c.primary, borderRadius: radius.xl, marginTop: spacing[6], paddingVertical: spacing[4] }}><AppText color="#ffffff" style={{ fontFamily: typography.family.sansBold }}>Kirim Jawaban</AppText></Pressable>}</View>{completed && <View style={{ alignItems: 'center', paddingTop: spacing[6] }}><AppText color={c.text} style={{ fontFamily: typography.family.sansBold, fontSize: 18, textAlign: 'center' }}>Kuis Hari Ini Sudah Selesai!</AppText><AppText color={c.onSurfaceVariant} style={{ marginTop: spacing[2], textAlign: 'center' }}>Kembali lagi besok untuk soal berikutnya.</AppText></View>}</ScrollView></ScreenContainer>;
}
