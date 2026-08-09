import { Text, View } from 'react-native';

import type { ExerciseDetailStyles } from '../screens/ExerciseDetailScreen.styles';

type ExerciseDetailTextListProps = {
  emptyLabel: string;
  items: string[];
  styles: ExerciseDetailStyles;
};

export function ExerciseDetailTextList({
  emptyLabel,
  items,
  styles,
}: ExerciseDetailTextListProps) {
  if (items.length === 0) {
    return <Text style={styles.secondaryText}>{emptyLabel}</Text>;
  }

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Text key={item} style={styles.bodyText}>
          {item}
        </Text>
      ))}
    </View>
  );
}
