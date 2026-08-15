# Latest Handoff

Updated: 2026-08-15

Exact Git history, source and CI override prose if this handoff becomes stale.

Detailed backend behavior is intentionally not copied here. Use the [canonical backend baseline](https://github.com/ivangemini/smart-fitness-backend/blob/main/docs/project-context.md) and `docs/implementation-plan.md`.

## Restart checkpoint

### Mobile

- current `main`: `9313fa18419dc657423a7d363724b017b8519392` (#662);
- latest merged runtime/source checkpoint before the active work: `97bb0abf5b097739cf30805cc26e4ef62435c01d` (#660);
- active prepared branch: `fix/p14-home-steps-docs`.

The active branch contains:

- fail-closed Home consumption of the existing provider-neutral Steps source;
- foreground and next-local-midnight daily Steps refresh behavior plus DST boundary coverage;
- the Labs product-scope contradiction removed from `docs/project-context.md`;
- `docs/backend/` reduced to one redirect document;
- mobile documentation links redirected to canonical backend references.

No HealthKit/Health Connect dependency, permission request or native activation is included.

### Backend

- current `main`: `2b73f34e168d7a6a1dd4087df1a1992e44137d54` (#241);
- #241 merged after green exact-head Backend CI and no review threads.

#241 closes the reproduced client-selected push `deviceId` authority defect, public Labs storage-diagnostic leakage, strict Labs → Coach/model exposure-policy gap and backend API/data-model documentation drift. It does not deploy or activate providers.

## Active continuation target

No large independent provider-neutral source package should start automatically from this checkpoint.

Meaningful remaining work is gate-dependent:

1. concrete APNs/FCM delivery, provider configuration and production worker scheduling;
2. native push permission/token lifecycle plus offline reconnect convergence;
3. HealthKit/Health Connect adapters/permissions and physical-device Steps evidence;
4. Labs production storage/OCR/model/native-picker runtime and evidence;
5. Stories deployed/physical-device/second-device evidence.

While those gates remain closed, continue bounded defect audits, QA/evidence preparation and canonical docs/reference repair.

## Contracts to preserve

- local logout erases reusable auth credentials even if remote logout fails;
- push registration identity derives from the authenticated backend device, not a client-selected registration body field;
- Social/Stories remain server-authoritative and separate from private revisioned fitness sync;
- Labs is approved private server-authoritative product scope, remains non-Social/non-diagnostic and exposes only confirmed structured facts at the Coach/model boundary;
- provider-backed capabilities fail closed until configured and authorized;
- source CI does not substitute for provider/device/deployment evidence;
- no automatic Coach proposal application;
- Steps remain `—` when no authorized source is available and must never be fabricated from workout/demo data.

## Closed activation gates

Without direct authorization, do not deploy backend code/migrations, activate providers/workers, request native permissions implicitly, activate HealthKit/Health Connect or production Labs providers, publish OTA/EAS, build/install native releases, access/mutate production data or submit to app stores.
