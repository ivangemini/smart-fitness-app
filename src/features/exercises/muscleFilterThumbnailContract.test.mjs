import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

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

describe('canonical muscle-map rendering contract', () => {
  it('reuses one canonical SVG geometry authority for full and thumbnail anatomy', () => {
    expect(anatomySource).toMatch(/MUSCLE_ANATOMY_REGIONS/);
    expect(anatomySource).toMatch(/id: 'side-delts'/);
    expect(bodySvgSource).toMatch(/MUSCLE_ANATOMY_REGIONS/);
    expect(thumbnailSource).toMatch(/BodyMuscleSvg/);
    expect(mapSource).toMatch(/BodyMuscleSvg/);
    expect(thumbnailSource).not.toMatch(/data:image\/svg\+xml/);
    expect(mapSource).not.toMatch(/data:image\/svg\+xml/);
  });

  it('retains text labels while adding shared muscle thumbnails to filter chips', () => {
    expect(controlsSource).toMatch(/MuscleFilterThumbnail muscleName=\{option\}/);
    expect(controlsSource).toMatch(/\{option\}/);
    expect(controlsSource).toMatch(/accessibilityState=\{\{ selected: active \}\}/);
  });

  it('resolves interactive body-map taps through exact canonical provider options', () => {
    expect(controlsSource).toMatch(/InteractiveMuscleFilter/);
    expect(interactiveSource).toMatch(/mapMuscleNameToCanonicalId/);
    expect(interactiveSource).toMatch(/optionByMuscleId\.get\(muscleId\)/);
    expect(interactiveSource).toMatch(/if \(!exactOption\) return/);
    expect(interactiveSource).toMatch(/onChange\(activeMuscleId === muscleId \? undefined : exactOption\)/);
    expect(bodySvgSource).toMatch(/onMusclePress\(region\.id\)/);
  });
});