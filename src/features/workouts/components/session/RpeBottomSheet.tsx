import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LiquidGlassSurface } from '@/components/ui/LiquidGlassSurface';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Colors, Spacing } from '@/constants/theme';
import { type MessageKey, useLocalization } from '@/localization';
import { useAppTheme } from '@/theme/AppThemeProvider';
import type { WorkoutRpe } from '@/types';

export const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10] as const;

type RpeBottomSheetProps = {
  selectedRpe?: WorkoutRpe;
  setLabel: string;
  visible: boolean;
  onDismiss: () => void;
  onSelect: (value: WorkoutRpe) => void;
  onSkip: () => void;
};

const getRpeHelper = (value: WorkoutRpe | undefined, t: (key: MessageKey) => string) => {
  switch (value) {
    case 6:
      return '≈ 4+ reps in reserve';
    case 7:
      return '≈ 3 RIR';
    case 8:
      return '≈ 2 RIR';
    case 9:
      return '≈ 1 RIR';
    case 10:
      return t('workouts.session.rpeFailure');
    default:
      return t(
        value
          ? 'workouts.session.rpeHelperReserve'
          : 'workouts.session.rpeHelperDefault',
      );
  }
};

export function RpeBottomSheet({
  selectedRpe,
  setLabel,
  visible,
  onDismiss,
  onSelect,
  onSkip,
}: RpeBottomSheetProps) {
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const hiddenTranslateY = Math.min(420, Math.max(260, Math.round(height * 0.45)));
  const translateY = useRef(new Animated.Value(hiddenTranslateY)).current;
  const [localSelection, setLocalSelection] = useState(selectedRpe);

  useEffect(() => {
    if (visible) {
      setLocalSelection(selectedRpe);
      translateY.setValue(hiddenTranslateY);
      Animated.spring(translateY, {
        damping: 24,
        mass: 0.9,
        stiffness: 260,
        toValue: 0,
        useNativeDriver: true,
      }).start();
      return;
    }

    translateY.setValue(hiddenTranslateY);
  }, [hiddenTranslateY, selectedRpe, translateY, visible]);

  const dismissWithAnimation = (afterDismiss?: () => void) => {
    Animated.timing(translateY, {
      duration: 220,
      toValue: hiddenTranslateY,
      useNativeDriver: true,
    }).start(() => {
      afterDismiss?.();
      onDismiss();
    });
  };

  const chooseRpe = (value: WorkoutRpe) => {
    setLocalSelection(value);
    onSelect(value);
    setTimeout(() => dismissWithAnimation(), 120);
  };

  const helperRpe = localSelection ?? selectedRpe;

  return (
    <Modal animationType="none" transparent visible={visible} onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityLabel={t('workouts.session.rpeDismiss')}
          onPress={() => dismissWithAnimation()}
          style={styles.scrim}
        />
        <Animated.View style={[styles.sheetMotion, { transform: [{ translateY }] }]}>
          <LiquidGlassSurface
            radius={24}
            style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.two }]}
            variant="elevated">
            <Text style={styles.title}>{t('workouts.session.rpeTitle', { set: setLabel })}</Text>
            <View style={styles.values}>
              {RPE_VALUES.map((value) => {
                const selected = helperRpe === value;
                return (
                  <Pressable
                    accessibilityLabel={`RPE ${value}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={value}
                    onPress={() => chooseRpe(value)}
                    style={({ pressed }) => [
                      styles.valueButton,
                      selected && styles.valueButtonSelected,
                      pressed && styles.pressed,
                    ]}>
                    <Text style={[styles.valueLabel, selected && styles.valueLabelSelected]}>
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.helper}>
              <Text style={styles.helperTitle}>{helperRpe ? `RPE ${helperRpe}` : 'RPE'}</Text>
              <Text style={styles.helperText}>{getRpeHelper(helperRpe, t)}</Text>
            </View>
            <SecondaryButton
              label={t('workouts.session.rpeSkip')}
              onPress={() => dismissWithAnimation(onSkip)}
            />
          </LiquidGlassSurface>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: typeof Colors.light) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'flex-end',
    },
    helper: {
      alignItems: 'center',
      gap: Spacing.half,
      paddingVertical: Spacing.one,
    },
    helperText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
      lineHeight: 18,
      textAlign: 'center',
    },
    helperTitle: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '800',
      lineHeight: 18,
    },
    pressed: {
      opacity: 0.72,
    },
    scrim: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.overlay,
    },
    sheet: {
      gap: Spacing.two,
      paddingHorizontal: Spacing.two,
      paddingTop: Spacing.three,
    },
    sheetMotion: {
      alignSelf: 'center',
      maxWidth: 480,
      paddingHorizontal: Spacing.two,
      width: '100%',
    },
    title: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '800',
      lineHeight: 22,
      textAlign: 'center',
    },
    valueButton: {
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      borderColor: colors.borderSubtle,
      borderCurve: 'continuous',
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      flexBasis: '18%',
      flexGrow: 1,
      justifyContent: 'center',
      maxWidth: 84,
      minHeight: 44,
      minWidth: 44,
      paddingHorizontal: Spacing.one,
    },
    valueButtonSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    valueLabel: {
      color: colors.textPrimary,
      fontSize: 13,
      fontVariant: ['tabular-nums'],
      fontWeight: '800',
    },
    valueLabelSelected: {
      color: colors.textOnAccent,
    },
    values: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      justifyContent: 'center',
    },
  });
