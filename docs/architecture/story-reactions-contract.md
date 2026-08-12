# Story Reactions Contract — S9-E

Updated: 2026-08-12
Status: approved for backend-first source implementation

## Goal

Add one bounded, privacy-preserving reaction choice to an active Story without expanding the base Story DTO or introducing replies, DMs, notifications, liker identity, ranking, analytics, or a second media lifecycle.

S9-D private Like remains a separate existing interaction. S9-E does not migrate, replace, or reinterpret `social_story_likes`.

## Product semantics

A non-owner viewer who can currently read an active Story may have at most one S9-E reaction on that Story.

The fixed wire-level reaction set is:

- `love` → ❤️
- `fire` → 🔥
- `strong` → 💪
- `clap` → 👏

Wire values are stable semantic identifiers. Emoji glyphs are presentation only and must not be persisted as authority.

Setting a reaction when none exists creates it. Setting a different reaction replaces the viewer's previous S9-E reaction atomically. Setting the same reaction again is idempotent and leaves the same state. Clearing removes the viewer's reaction and is idempotent.

A Story owner cannot react to their own Story. Existing S9-D Like behavior remains unchanged and may coexist independently with one S9-E reaction.

## Authority and persistence

Backend PostgreSQL is authoritative.

Use a dedicated `social_story_reactions` relation rather than extending the base Story row or the private `social_story_likes` relation.

Required relational invariants:

- one row per `(story_id, user_id)`;
- strict bounded reaction type enforced at the application trust boundary and represented with a database constraint or equivalent bounded schema evidence;
- Story foreign key cascades on Story deletion;
- user foreign key cascades on account deletion;
- timestamps are server-owned;
- owner/viewer identity is never accepted from the request payload.

S9-E remains server-authoritative Social state and must not enter private revisioned `AppState` synchronization.

## API contract

Keep reactions in strict subresources separate from the base Story DTO.

Viewer state:

- `GET /v1/social/stories/:storyId/reaction`
- response: `{ schemaVersion: 1, storyId, reaction: StoryReactionType | null }`

Set/replace reaction:

- `PUT /v1/social/stories/:storyId/reaction`
- body: `{ reaction: StoryReactionType }`
- response: same viewer-state DTO
- uses the existing Social reaction-toggle write-rate-limit class or an equally bounded existing class; do not create an unbounded write lane.

Clear reaction:

- `DELETE /v1/social/stories/:storyId/reaction`
- response: viewer state with `reaction: null`

Owner aggregate:

- `GET /v1/social/stories/:storyId/reaction-summary`
- owner-only response: `{ schemaVersion: 1, storyId, counts: { love, fire, strong, clap }, totalCount }`

The aggregate contains counts only. It must not expose reacting user IDs, usernames, profiles, ordered reactor lists, timestamps, or other identity-bearing metadata.

## Visibility and lifecycle

All reaction operations inherit the existing Story readability/privacy authority:

- active/unexpired Story only;
- self/Following/private-account visibility rules;
- block and restriction behavior;
- hidden/inaccessible Story returns the same not-found style boundary used by Story Like rather than revealing existence;
- owner summary is available only to the Story owner while the Story remains readable under the existing owner path.

Lifecycle cleanup must cover:

- Story deletion;
- Story expiry/readability boundary;
- account deletion;
- block/restriction semantics where existing Story Like aggregation excludes no-longer-visible interactions.

No reaction resurrects or extends Story lifetime.

## Privacy and export

S9-E is account-linked Social interaction data.

Requester data-access export may include only the requester's own reaction records using the existing strict Social export projection conventions. Owner export must not gain reactor identities merely because aggregate counts are visible in product UI.

Technical inventory and complete Social export/audit allowlists must be updated alongside persistence.

No raw internal reaction row, foreign-key UUID linkage beyond already approved requester-owned export semantics, hidden profile data, or cross-user identity list may leak through export.

## Mobile surface

After compatible backend authority is merged:

- add strict reaction contracts/parsers/API functions separate from Story DTO parsing;
- Story viewer shows the four bounded reaction choices for a readable non-owned Story;
- selected reaction has explicit material/pressed/selected state and remains accessible without relying on color alone;
- owner Story viewer may show aggregate counts by the four reaction types and total, never identities;
- preserve existing S9-D Like control and privacy-separated owner Like summary;
- preserve safe-area ownership, one scroll/gesture authority, responsive narrow-width behavior and EN/RU copy conventions;
- do not add reaction state to private `AppState` sync or durable fake/local authority.

Optimistic presentation is allowed only if rollback/revalidation keeps server state authoritative. A simple request-then-refresh flow is also acceptable.

## Explicit non-goals

S9-E does not add:

- replies or DMs;
- liker/reactor lists;
- reaction notifications;
- per-Story audience controls or Close Friends;
- video;
- archive/highlights;
- ranking/recommendation/retention signals;
- analytics or telemetry;
- free-form/custom emoji;
- reaction counts in the base Story DTO;
- automatic migration of S9-D Like into reaction state.

Each of those requires separate prioritization and a reviewed contract.

## Implementation order

1. merge this reviewed contract;
2. implement backend schema/migration/repository/service/routes/privacy/export/tests;
3. require exact-head Backend CI, Backend PostgreSQL CI, and any other path-triggered permanent gate to pass;
4. merge backend authority;
5. implement strict mobile contracts/parsers/API/viewer/owner-summary surfaces and regression tests;
6. require exact-head Mobile CI;
7. merge mobile source;
8. update roadmap/status/handoff as source/CI-complete while keeping environment/runtime/release evidence explicitly separate.

No migration execution, backend deployment, provider activation, OTA/EAS publication, native build/install, or production activation is authorized by this contract.
