import type { CanonicalMuscleId, MuscleSide } from './muscleTaxonomy';

export const MUSCLE_ANATOMY_VIEWBOX = {
  height: 400,
  width: 200,
} as const;

export type MuscleAnatomyPrimitive =
  | {
      kind: 'circle';
      cx: number;
      cy: number;
      r: number;
    }
  | {
      kind: 'path';
      d: string;
    }
  | {
      kind: 'rect';
      height: number;
      rx: number;
      width: number;
      x: number;
      y: number;
    };

export type MuscleAnatomyRegion = {
  id: CanonicalMuscleId;
  primitives: MuscleAnatomyPrimitive[];
};

export const MUSCLE_ANATOMY_REGIONS: Record<MuscleSide, MuscleAnatomyRegion[]> = {
  front: [
    {
      id: 'front-delts',
      primitives: [
        { kind: 'circle', cx: 68, cy: 82, r: 13 },
        { kind: 'circle', cx: 132, cy: 82, r: 13 },
      ],
    },
    {
      id: 'side-delts',
      primitives: [
        { kind: 'circle', cx: 61, cy: 88, r: 11 },
        { kind: 'circle', cx: 139, cy: 88, r: 11 },
      ],
    },
    {
      id: 'chest',
      primitives: [
        { kind: 'path', d: 'M70 91c8-8 18-10 30-6v39H70c-7-9-7-23 0-33z' },
        { kind: 'path', d: 'M130 91c-8-8-18-10-30-6v39h30c7-9 7-23 0-33z' },
      ],
    },
    {
      id: 'biceps',
      primitives: [
        { kind: 'rect', x: 45, y: 98, width: 18, height: 54, rx: 9 },
        { kind: 'rect', x: 137, y: 98, width: 18, height: 54, rx: 9 },
      ],
    },
    {
      id: 'forearms',
      primitives: [
        { kind: 'rect', x: 35, y: 150, width: 16, height: 58, rx: 8 },
        { kind: 'rect', x: 149, y: 150, width: 16, height: 58, rx: 8 },
      ],
    },
    {
      id: 'abs',
      primitives: [{ kind: 'rect', x: 78, y: 126, width: 44, height: 62, rx: 15 }],
    },
    {
      id: 'obliques',
      primitives: [
        { kind: 'rect', x: 62, y: 130, width: 18, height: 58, rx: 9 },
        { kind: 'rect', x: 120, y: 130, width: 18, height: 58, rx: 9 },
      ],
    },
    {
      id: 'quads',
      primitives: [
        { kind: 'rect', x: 68, y: 202, width: 26, height: 76, rx: 12 },
        { kind: 'rect', x: 106, y: 202, width: 26, height: 76, rx: 12 },
      ],
    },
  ],
  back: [
    {
      id: 'rear-delts',
      primitives: [
        { kind: 'circle', cx: 68, cy: 82, r: 13 },
        { kind: 'circle', cx: 132, cy: 82, r: 13 },
      ],
    },
    {
      id: 'traps',
      primitives: [{ kind: 'path', d: 'M82 72h36l18 46H64z' }],
    },
    {
      id: 'lats',
      primitives: [
        { kind: 'path', d: 'M63 114h30v78H50z' },
        { kind: 'path', d: 'M107 114h30l13 78h-43z' },
      ],
    },
    {
      id: 'triceps',
      primitives: [
        { kind: 'rect', x: 45, y: 98, width: 18, height: 54, rx: 9 },
        { kind: 'rect', x: 137, y: 98, width: 18, height: 54, rx: 9 },
      ],
    },
    {
      id: 'lower-back',
      primitives: [{ kind: 'rect', x: 78, y: 164, width: 44, height: 42, rx: 14 }],
    },
    {
      id: 'glutes',
      primitives: [
        { kind: 'rect', x: 66, y: 206, width: 30, height: 36, rx: 14 },
        { kind: 'rect', x: 104, y: 206, width: 30, height: 36, rx: 14 },
      ],
    },
    {
      id: 'hamstrings',
      primitives: [
        { kind: 'rect', x: 68, y: 244, width: 26, height: 72, rx: 12 },
        { kind: 'rect', x: 106, y: 244, width: 26, height: 72, rx: 12 },
      ],
    },
    {
      id: 'calves',
      primitives: [
        { kind: 'rect', x: 70, y: 318, width: 22, height: 58, rx: 10 },
        { kind: 'rect', x: 108, y: 318, width: 22, height: 58, rx: 10 },
      ],
    },
  ],
};

export const getMuscleAnatomyRegion = (id: CanonicalMuscleId) => {
  for (const side of ['front', 'back'] as const) {
    const region = MUSCLE_ANATOMY_REGIONS[side].find((candidate) => candidate.id === id);
    if (region) return { region, side };
  }
  return null;
};