import { describe, expect, test } from 'vitest';

declare const __dirname: string;
declare const require: any;

const { readFileSync } = require('fs') as {
  readFileSync: (path: string, encoding: string) => string;
};
const { resolve } = require('path') as {
  resolve: (...parts: string[]) => string;
};

const projectRoot = resolve(__dirname, '..');
const readSource = (relativePath: string) =>
  readFileSync(resolve(projectRoot, relativePath), 'utf8');

describe('list virtualization boundaries', () => {
  test('Nutrition Diary keeps one SectionList boundary for food-entry rows', () => {
    const route = readSource('src/app/(tabs)/nutrition.tsx');
    const list = readSource(
      'src/features/nutrition/components/NutritionDiaryList.tsx',
    );
    expect(route).toContain('NutritionDiaryList');
    expect(route).not.toContain('<ScrollView');
    expect(list).toContain('SectionList');
    expect(list).toContain('keyExtractor={(entry) => entry.id}');
  });

  test('Programs tab keeps a FlatList keyed by stable program id', () => {
    const source = readSource('src/features/workouts/screens/WorkoutsScreen.tsx');
    expect(source).toContain('FlatList');
    expect(source).toContain('data={visibleProgramSummaries}');
    expect(source).toContain('keyExtractor={(summary) => summary.program.id}');
    expect(source).not.toContain('{visibleProgramSummaries.map(');
  });

  test('Workout History keeps a FlatList keyed by stable session id', () => {
    const source = readSource('src/features/workouts/screens/WorkoutHistoryScreen.tsx');
    expect(source).toContain('FlatList');
    expect(source).toContain('data={history}');
    expect(source).toContain('keyExtractor={(item) => item.session.id}');
    expect(source).not.toContain('{history.map(');
  });

  test('Active Session keeps one FlatList boundary for arbitrary exercise count', () => {
    const body = readSource(
      'src/features/workouts/components/session/WorkoutSessionBody.tsx',
    );

    expect(body).toContain('<FlatList');
    expect(body).toContain('data={visibleExercises}');
    expect(body).toContain('keyExtractor={(exercise) => exercise.id}');
    expect(body).not.toContain('<ScrollView');
    expect(body).not.toContain('visibleExercises.map(');
    expect(body).toContain('automaticallyAdjustKeyboardInsets');
    expect(body).toContain('keyboardShouldPersistTaps="handled"');
    expect(body).toContain('<WorkoutSessionEmptyWorkoutCard');
    expect(body).toContain('<WorkoutSessionFooterActions');
  });

  test('Safety Recovery review virtualizes unbounded restriction and finding rows', () => {
    const screen = readSource(
      'src/features/coach/screens/SafetyRecoveryCoachScreen.tsx',
    );
    const viewModel = readSource('src/features/coach/safetyRecoveryViewModel.ts');

    expect(screen).toContain('<FlatList');
    expect(screen).toContain('data={reviewItems}');
    expect(screen).toContain('keyExtractor={(item) => item.id}');
    expect(screen).not.toContain('<ScrollView');
    expect(screen).toContain('id: `restriction:${restriction.limitationId}`');
    expect(screen).toContain('resultReadiness.issueKeys?.[index]');
    expect(viewModel).toContain('issueKeys?: string[];');
    expect(viewModel).toContain("typeof path !== 'string'");
  });

  test('Exercise Library keeps one SectionList and stable exercise ids', () => {
    const route = readSource('src/app/workouts/exercise-library.tsx');
    const browser = readSource(
      'src/components/workouts/VirtualizedWorkoutExerciseLibrary.tsx',
    );
    expect(route).not.toContain('<ScrollView');
    expect(browser).toContain('SectionList');
    expect(browser).toContain('keyExtractor={(exercise) => exercise.id}');
  });

  test('paginated Social surfaces keep virtualized list boundaries', () => {
    const notifications = readSource(
      'src/features/social/screens/SocialNotificationScreen.tsx',
    );
    const following = readSource(
      'src/features/social/screens/SocialFollowingFeedScreen.tsx',
    );
    const profilePosts = readSource(
      'src/features/social/screens/SocialProfileWorkoutPostsScreen.tsx',
    );
    const relationships = readSource(
      'src/features/social/screens/SocialRelationshipListsScreen.tsx',
    );

    expect(notifications).toContain('FlatList');
    expect(notifications).toContain('keyExtractor={(notification) => notification.id}');
    expect(notifications).not.toContain('notifications.map(');
    expect(notifications).not.toContain('<ScrollView');

    expect(following).toContain('FlatList');
    expect(following).toContain('keyExtractor={(post) => post.id}');
    expect(following).not.toContain('feed.posts.map(');
    expect(following).not.toContain('<ScrollView');

    expect(profilePosts).toContain('FlatList');
    expect(profilePosts).toContain('keyExtractor={(post) => post.id}');
    expect(profilePosts).not.toContain('posts.map(');
    expect(profilePosts).not.toContain('<ScrollView');

    expect(relationships).toContain('FlatList');
    expect(relationships).toContain('keyExtractor={(item) => item.profile.username}');
    expect(relationships).not.toContain('items.map(');
    expect(relationships).not.toContain('<ScrollView');
  });

  test('workout post comments use the detail FlatList as their sole list boundary', () => {
    const detail = readSource(
      'src/features/social/screens/SocialWorkoutPostDetailScreen.tsx',
    );
    const comments = readSource(
      'src/features/social/SocialWorkoutCommentsCard.tsx',
    );

    expect(detail).toContain('FlatList');
    expect(detail).toContain('data={commentListData}');
    expect(detail).toContain('keyExtractor={(comment) => comment.id}');
    expect(detail).not.toContain('<ScrollView');
    expect(comments).not.toContain('comments.map(');
    expect(comments).not.toContain('FlatList');
  });

  test('bounded secondary nutrition and progress surfaces stay bounded', () => {
    const addFood = readSource('src/app/nutrition/add-food.tsx');
    const addFoodModel = readSource('src/features/nutrition/addFoodModel.ts');
    const progress = readSource('src/app/(tabs)/progress.tsx');

    expect(addFood).toContain('defaultCatalogResults.slice(0, 18)');
    expect(addFoodModel).toContain('return items.slice(0, 20)');
    expect(progress).toContain('analytics.measurements.slice(0, 3)');
  });
});
