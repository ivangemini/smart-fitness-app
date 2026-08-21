import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();
const thumbnailPath = path.join(root, 'src/features/exercises/components/MuscleFilterThumbnail.tsx');
const controlsPath = path.join(root, 'src/features/workouts/screens/WorkoutExerciseLibraryControls.tsx');

const thumbnailSource = fs.readFileSync(thumbnailPath, 'utf8');
const controlsSource = fs.readFileSync(controlsPath, 'utf8');

test('muscle filter thumbnails reuse canonical muscle mapping', () => {
  assert.match(thumbnailSource, /mapMuscleNameToCanonicalId/);
  assert.match(thumbnailSource, /CANONICAL_MUSCLES/);
  assert.match(thumbnailSource, /data:image\/svg\+xml/);
});

test('exercise filter chips render the muscle thumbnail additively with text', () => {
  assert.match(controlsSource, /MuscleFilterThumbnail muscleName=\{option\}/);
  assert.match(controlsSource, /\{option\}/);
  assert.match(controlsSource, /accessibilityState=\{\{ selected: active \}\}/);
});
