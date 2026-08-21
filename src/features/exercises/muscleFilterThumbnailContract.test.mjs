import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();
const anatomyPath = path.join(root, 'src/features/exercises/muscleAnatomy.ts');
const bodySvgPath = path.join(root, 'src/features/exercises/components/BodyMuscleSvg.tsx');
const thumbnailPath = path.join(root, 'src/features/exercises/components/MuscleFilterThumbnail.tsx');
const mapPath = path.join(root, 'src/features/exercises/components/MuscleMap.tsx');
const interactivePath = path.join(root, 'src/features/exercises/components/InteractiveMuscleFilter.tsx');
const controlsPath = path.join(root, 'src/features/workouts/screens/WorkoutExerciseLibraryControls.tsx');

const anatomySource = fs.readFileSync(anatomyPath, 'utf8');
const bodySvgSource = fs.readFileSync(bodySvgPath, 'utf8');
const thumbnailSource = fs.readFileSync(thumbnailPath, 'utf8');
const mapSource = fs.readFileSync(mapPath, 'utf8');
const interactiveSource = fs.readFileSync(interactivePath, 'utf8');
const controlsSource = fs.readFileSync(controlsPath, 'utf8');

test('full and thumbnail anatomy reuse one canonical SVG geometry authority', () => {
  assert.match(anatomySource, /MUSCLE_ANATOMY_REGIONS/);
  assert.match(anatomySource, /id: 'side-delts'/);
  assert.match(bodySvgSource, /MUSCLE_ANATOMY_REGIONS/);
  assert.match(thumbnailSource, /BodyMuscleSvg/);
  assert.match(mapSource, /BodyMuscleSvg/);
  assert.doesNotMatch(thumbnailSource, /data:image\/svg\+xml/);
  assert.doesNotMatch(mapSource, /data:image\/svg\+xml/);
});

test('exercise filter chips retain text and add shared muscle thumbnails', () => {
  assert.match(controlsSource, /MuscleFilterThumbnail muscleName=\{option\}/);
  assert.match(controlsSource, /\{option\}/);
  assert.match(controlsSource, /accessibilityState=\{\{ selected: active \}\}/);
});

test('interactive body map resolves taps through exact canonical provider options', () => {
  assert.match(controlsSource, /InteractiveMuscleFilter/);
  assert.match(interactiveSource, /mapMuscleNameToCanonicalId/);
  assert.match(interactiveSource, /optionByMuscleId\.get\(muscleId\)/);
  assert.match(interactiveSource, /if \(!exactOption\) return/);
  assert.match(interactiveSource, /onChange\(activeMuscleId === muscleId \? undefined : exactOption\)/);
  assert.match(bodySvgSource, /onMusclePress\(region\.id\)/);
});