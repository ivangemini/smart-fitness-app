# Exercise Catalog Providers

Updated: 2026-08-22

The app defaults to the reviewed local exercise fixture in production builds.

## Local canonical catalog

`src/data/exercises/exercises.json` is the production local fixture. Runtime exercise identity uses each row's `internalId` when present.

The reviewed richer Exercise Intelligence authority is separate from provider payloads:

- `src/features/exercises/exerciseIntelligence.ts` owns `exercise-intelligence-v1`;
- it is keyed by canonical local runtime exercise ID;
- it contains reviewed movement pattern, technique cues, common errors, range-of-motion guidance, qualitative fatigue cost and reviewed substitutions;
- user-facing reviewed guidance is stored in EN/RU;
- unknown IDs return no intelligence rather than receiving inferred metadata.

Do not infer reviewed intelligence from exercise names, body-part values, target muscles or secondary muscles at runtime.

## OSS ExerciseDB development provider

Internal development or preview builds may enable the free OSS ExerciseDB provider with:

```sh
EXPO_PUBLIC_ENABLE_OSS_EXERCISEDB=true
```

This flag is not a secret and is not an API key. It only selects the free hosted ExerciseDB V1 endpoint for internal testing.

Do not enable this flag for App Store production builds. The free OSS ExerciseDB media is for development, prototypes and non-commercial testing; production profiles must set `EXPO_PUBLIC_ENABLE_OSS_EXERCISEDB=false` or omit the variable.

Existing OSS normalization may reuse a local canonical ID when a remote exercise matches the reviewed local identity. Only in that case may the Exercise Detail surface show the local reviewed `exercise-intelligence-v1` metadata. A remote-only `exdb-*` identity remains unreviewed and must fail closed.

Provider data does not become authority for qualitative fatigue cost, substitutions or technique simply because remote text exists.

## Cache keys

Exercise metadata cache keys are provider-specific:

- `exercise-cache:oss-exercisedb:v2`
- `exercise-cache:local:v1`

The reviewed Exercise Intelligence registry is static application source and is not stored in those provider caches.
