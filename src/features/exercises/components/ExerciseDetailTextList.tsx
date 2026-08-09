import { Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

type ExerciseDetailTextListProps = {
  emptyLabel: string;
  items: string[];
  styles: {
    bodyText: StyleProp<TextStyle>;
    list: StyleProp<ViewStyle>;
    secondaryText: StyleProp<TextStyle>;
  };
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
