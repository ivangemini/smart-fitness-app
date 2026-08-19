# Proactive Coach Presentation State

Updated: 2026-08-19

This document defines the local presentation-state boundary for Phase 16 Proactive Coach. It does not create a new fitness-data authority, synchronized domain, notification system, or recommendation authority.

## Purpose

The deterministic proactive insight selector needs a small amount of presentation memory to avoid repeatedly showing the same observation:

- when any proactive insight was last shown;
- which evidence-derived insight keys the current account dismissed.

This state exists only to control presentation frequency and dismissal. It must never change workout/progress facts or determine canonical training truth.

## Ownership

The state is:

- local to the current device;
- account-scoped by authenticated user id;
- stored through the existing `StorageAdapter` / AsyncStorage boundary;
- separate from private revisioned fitness `AppState` synchronization;
- separate from Coach backend run history and server-authoritative domains;
- removed by the existing local account-data cleanup path.

No cross-device synchronization is claimed for v1. A user may therefore have independent cooldown/dismissal state on different devices. Changing that would require an explicit ownership/sync product contract.

## Schema

Version 1 contains only:

- `schemaVersion: 1`;
- `lastShownAt: string | null` as validated normalized ISO time;
- `dismissedKeys: string[]`.

Limits:

- at most 32 dismissed keys are retained;
- each key is at most 240 characters;
- keys are trimmed, unique and stored newest-first when dismissed through the store;
- malformed JSON or an unknown schema version fails closed to an empty presentation state.

The record must not contain workout data, exercise history, Labs data, model output, prompt text, provider metadata, health notes, email, tokens, or secrets.

## Mutation semantics

- `recordShown` requires a valid timestamp and updates only `lastShownAt`.
- `dismiss` requires a valid bounded insight key, deduplicates it and moves it to the front of the bounded list.
- mutations for one account key are serialized so concurrent dismissals cannot overwrite each other.
- a failed storage write rejects to the caller; a failed queued mutation must not poison later mutations.
- `clear` removes only the current account's proactive presentation record.

## Account lifecycle

`getProactivePresentationStorageKey(userId)` is part of `getLocalAccountDataStorageKeys(userId)`. Therefore normal local account-deletion cleanup and its restart recovery remove the proactive presentation state together with other private account-scoped local material.

Device-global appearance/preferences remain outside this cleanup as before.

## Later UI integration

A later presentation package may load this state, pass it into the deterministic selector, and update it after an actual presentation/dismissal. That package must still define:

- the exact moment that counts as `shown`;
- prevention of repeated writes on React rerenders;
- localized neutral copy;
- accessible dismissal controls;
- Progress drill-down destinations;
- behavior on storage read/write failure.

No background/push delivery or automatic canonical mutation is authorized by this storage contract.